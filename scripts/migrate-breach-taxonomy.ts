import fs from "fs";
import path from "path";
import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from "firebase-admin/app";
import {
  getFirestore,
  WriteBatch,
  QuerySnapshot,
  DocumentData,
} from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import { US_STATES_MAP } from "../src/types/state-regulation";

interface LegacyElement {
  canonical_phrase: string;
  category?: string;
  sensitivity_level?: string;
  synonyms?: string[];
  semantic_cluster?: string;
  global_identifier?: string | null;
  metadata?: {
    jurisdiction?: string;
    source?: string;
    original_line?: string;
    semantic_cluster?: string;
    [key: string]: unknown;
  } & Record<string, unknown>;
  [key: string]: unknown;
}

interface LegacyExport {
  version?: string;
  created_at?: string;
  element_count?: number;
  categories?: string[];
  sensitivity_levels?: string[];
  elements: LegacyElement[];
  [key: string]: unknown;
}

interface TaxonomyDocument {
  id: string;
  canonicalPhrase: string;
  category: string;
  sensitivityLevel: string;
  synonyms: string[];
  keywords?: string[];
  jurisdiction: {
    name: string;
    code?: string;
  };
  metadata?: Record<string, unknown>;
  source?: string;
  originalLine?: string;
  semanticCluster?: string;
  globalIdentifier?: string | null;
  raw?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

function usage(): void {
  console.error(
    "Usage: ts-node scripts/migrate-breach-taxonomy.ts <input-json> [--dry-run]"
  );
  process.exit(1);
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createStateReverseMap(): Record<string, string> {
  const reverse: Record<string, string> = {};
  Object.entries(US_STATES_MAP).forEach(([code, name]) => {
    reverse[name.toLowerCase()] = code;
  });
  return reverse;
}

function removeUndefinedValues(
  node: TaxonomyDocument
): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (value !== undefined) {
      output[key] = value;
    }
  }
  return output;
}

function normalizeElement(
  element: LegacyElement,
  stateReverseMap: Record<string, string>,
  nowIso: string
): TaxonomyDocument | null {
  const canonicalPhrase = element.canonical_phrase?.trim();
  if (!canonicalPhrase) {
    return null;
  }

  const jurisdictionName = element.metadata?.jurisdiction?.trim() || "UNKNOWN";
  const jurisdictionCode =
    stateReverseMap[jurisdictionName.toLowerCase()] || undefined;

  const category = element.category?.trim() || "custom";
  const sensitivityLevel = element.sensitivity_level?.trim() || "unknown";

  const synonyms = Array.isArray(element.synonyms)
    ? (element.synonyms.filter(
        (entry) => typeof entry === "string"
      ) as string[])
    : [];

  const semanticCluster =
    element.semantic_cluster || element.metadata?.semantic_cluster;

  const keywords = new Set<string>();
  [canonicalPhrase, category, sensitivityLevel].forEach((value) => {
    if (value) keywords.add(value);
  });
  synonyms.forEach((syn) => keywords.add(syn));
  if (semanticCluster && typeof semanticCluster === "string") {
    keywords.add(semanticCluster);
  }

  const metadata: Record<string, unknown> = {};
  const rawMeta: Record<string, unknown> = {};
  if (element.metadata) {
    Object.entries(element.metadata).forEach(([key, value]) => {
      if (value === undefined) return;
      switch (key) {
        case "source":
          metadata.source = value;
          break;
        case "original_line":
          metadata.originalLine = value;
          break;
        case "semantic_cluster":
          metadata.semanticCluster = value;
          break;
        case "jurisdiction":
          // already handled
          break;
        default:
          rawMeta[key] = value;
      }
    });
  }

  if (element.global_identifier !== undefined) {
    metadata.globalIdentifier = element.global_identifier;
  }

  const additionalFields = Object.entries(element).filter(([key]) =>
    [
      "canonical_phrase",
      "category",
      "sensitivity_level",
      "synonyms",
      "semantic_cluster",
      "global_identifier",
      "metadata",
    ].includes(key)
      ? false
      : true
  );
  if (additionalFields.length) {
    rawMeta.element = Object.fromEntries(additionalFields);
  }

  const idSource = `${jurisdictionCode || slugify(jurisdictionName)}_${slugify(
    canonicalPhrase
  )}`;
  const id = idSource.toUpperCase();

  return {
    id,
    canonicalPhrase,
    category,
    sensitivityLevel,
    synonyms,
    keywords: keywords.size ? Array.from(keywords) : undefined,
    jurisdiction: {
      name: jurisdictionName,
      code: jurisdictionCode,
    },
    metadata: Object.keys(metadata).length ? metadata : undefined,
    source: metadata.source as string | undefined,
    originalLine: metadata.originalLine as string | undefined,
    semanticCluster: metadata.semanticCluster as string | undefined,
    globalIdentifier: metadata.globalIdentifier as string | null | undefined,
    raw: Object.keys(rawMeta).length ? rawMeta : undefined,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

async function migrateTaxonomy({
  inputPath,
  dryRun,
}: {
  inputPath: string;
  dryRun: boolean;
}): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

  if (getApps().length === 0) {
    const serviceAccount: ServiceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n"),
    };

    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  const db = getFirestore();
  const fileContent = fs.readFileSync(inputPath, "utf-8");
  const parsed = JSON.parse(fileContent) as LegacyExport;

  if (!Array.isArray(parsed.elements)) {
    console.error("Input JSON is missing an 'elements' array.");
    process.exit(1);
  }

  const stateReverseMap = createStateReverseMap();
  const nowIso = new Date().toISOString();
  const docs: TaxonomyDocument[] = [];

  parsed.elements.forEach((element, index) => {
    const normalized = normalizeElement(element, stateReverseMap, nowIso);
    if (!normalized) {
      console.warn(
        `Skipping element at index ${index} (missing canonical phrase).`
      );
      return;
    }
    docs.push(normalized);
  });

  console.log(`Discovered ${docs.length} taxonomy items.`);
  if (dryRun) {
    console.log("Dry run complete. No changes written to Firestore.");
    return;
  }

  const collectionRef = db.collection("breach_trigger_taxonomies");

  // Truncate existing collection
  const existingSnapshot: QuerySnapshot<DocumentData> =
    await collectionRef.get();
  if (!existingSnapshot.empty) {
    console.log(`Deleting ${existingSnapshot.size} existing documents...`);
    const deleteBatch = db.batch();
    existingSnapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();
    console.log("Existing documents deleted.");
  }

  const chunkSize = 400;
  let processed = 0;

  while (processed < docs.length) {
    const batch: WriteBatch = db.batch();
    const slice = docs.slice(processed, processed + chunkSize);
    slice.forEach((docItem) => {
      const cleaned = removeUndefinedValues(docItem);
      batch.set(collectionRef.doc(docItem.id), cleaned, { merge: true });
    });
    await batch.commit();
    processed += slice.length;
    console.log(`Committed ${processed}/${docs.length} documents...`);
  }

  console.log("Migration complete.");
}

(async () => {
  const [inputArg, ...rest] = process.argv.slice(2);
  if (!inputArg) {
    usage();
  }
  const dryRun = rest.includes("--dry-run") || rest.includes("--dry");
  const resolvedPath = path.resolve(process.cwd(), inputArg);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Input file not found: ${resolvedPath}`);
    process.exit(1);
  }

  try {
    await migrateTaxonomy({ inputPath: resolvedPath, dryRun });
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
})();
