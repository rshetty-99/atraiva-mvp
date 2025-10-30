# PII Elements - Firestore Schema Recommendation

## 📊 Excel File Analysis

**File**: `PII_elements.xlsx`

- **Sheet**: Category-DataElement
- **Total Rows**: 19 PII elements
- **Total Categories**: 14 categories

## 🗄️ Recommended Collection Structure

### Option 1: Flat Structure (Recommended for Search & Filtering)

**Collection Name**: `pii_elements`

**Document Structure**:

```typescript
{
  id: string;                    // Auto-generated Firestore ID
  element: string;               // PII element name (e.g., "Full legal name")
  category: string;              // Category name (e.g., "Core Identifiers")
  categorySlug: string;          // URL-friendly slug (e.g., "core-identifiers")
  description?: string;          // Optional description
  riskLevel: string;            // "high" | "medium" | "low"
  isRegulated: boolean;         // Whether it's regulated by laws
  applicableRegulations: string[]; // e.g., ["GDPR", "CCPA", "HIPAA"]
  detectionPatterns: string[];  // Regex patterns for detection
  examples: string[];           // Example values
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy?: string;
    source: string;             // "PII_elements.xlsx"
  };
}
```

**Example Document**:

```json
{
  "id": "pii_001",
  "element": "Social Security number",
  "category": "Government-Issued Numbers",
  "categorySlug": "government-issued-numbers",
  "riskLevel": "high",
  "isRegulated": true,
  "applicableRegulations": ["HIPAA", "GLBA", "State Laws"],
  "detectionPatterns": ["\\d{3}-\\d{2}-\\d{4}", "\\d{9}"],
  "examples": ["123-45-6789", "987654321"],
  "metadata": {
    "createdAt": "2025-10-19T...",
    "updatedAt": "2025-10-19T...",
    "source": "PII_elements.xlsx"
  }
}
```

### Option 2: Hierarchical Structure (Better for Category-Based Queries)

**Collection Name**: `pii_categories`

**Document Structure**:

```typescript
{
  id: string; // Auto-generated ID
  category: string; // "Core Identifiers"
  categorySlug: string; // "core-identifiers"
  description: string;
  riskLevel: string; // Overall risk level for category
  elements: Array<{
    element: string;
    riskLevel: string;
    isRegulated: boolean;
    applicableRegulations: string[];
    detectionPatterns: string[];
    examples: string[];
  }>;
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }
}
```

## 📋 Category Mapping

Based on the Excel file, here are the 14 PII categories:

1. **Core Identifiers** (High Risk)

   - Full legal name, Alias, Preferred name, etc.

2. **Government-Issued Numbers** (High Risk)

   - SSN, Tax ID, Passport number, etc.

3. **Financial & Payment** (High Risk)

   - Bank account, Credit card, Routing number, etc.

4. **Health & Genetic** (High Risk - HIPAA)

   - Medical records, Health plan ID, DNA data, etc.

5. **Biometric Identifiers** (High Risk)

   - Fingerprint, Facial recognition, Iris scan, etc.

6. **Digital & Device IDs** (Medium Risk)

   - IP address, MAC address, Device ID, etc.

7. **Login & Security Credentials** (High Risk)

   - Username, Password, Security questions, etc.

8. **Location & Vehicle** (Medium Risk)

   - Geolocation, VIN, License plate, etc.

9. **Personal Characteristics & Demographics** (Medium Risk)

   - DOB, Age, Race, Gender, etc.

10. **Civic, Political & Legal** (Medium Risk)

    - Voting records, Political affiliation, etc.

11. **Education & Employment** (Low-Medium Risk)

    - Student ID, Grades, Employment history, etc.

12. **Media & Communications** (Medium Risk)

    - Email, Phone number, Social media, etc.

13. **Household & Utility** (Low-Medium Risk)

    - Address, Utility accounts, etc.

14. **Miscellaneous Unique Identifiers** (Medium-High Risk)
    - Passport image, License scan, etc.

## 🎯 Recommended Approach

### Primary Collection: `pii_elements` (Flat Structure)

**Why This is Best**:

1. ✅ Easy to search and filter
2. ✅ Efficient for AI detection algorithms
3. ✅ Simple to query by regulation
4. ✅ Flexible for future expansions
5. ✅ Works well with state regulations collection

### Secondary Collection: `pii_categories` (Reference Data)

Store category metadata separately for lookups and UI display.

## 🔐 Firestore Indexes

Create these compound indexes:

```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "pii_elements",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "riskLevel", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "pii_elements",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isRegulated", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "pii_elements",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "applicableRegulations", "arrayConfig": "CONTAINS" },
        { "fieldPath": "riskLevel", "order": "ASCENDING" }
      ]
    }
  ]
}
```

## 🔒 Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // PII Elements - Read for authenticated users
    match /pii_elements/{elementId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'platform_admin'];
    }

    // PII Categories - Read for authenticated users
    match /pii_categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'platform_admin'];
    }
  }
}
```

## 📝 TypeScript Interface

```typescript
// src/types/pii-element.ts
export interface PIIElement {
  id: string;
  element: string;
  category: PIICategory;
  categorySlug: string;
  description?: string;
  riskLevel: RiskLevel;
  isRegulated: boolean;
  applicableRegulations: Regulation[];
  detectionPatterns: string[];
  examples: string[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    source: string;
  };
}

export type PIICategory =
  | "Core Identifiers"
  | "Government-Issued Numbers"
  | "Financial & Payment"
  | "Health & Genetic"
  | "Biometric Identifiers"
  | "Digital & Device IDs"
  | "Login & Security Credentials"
  | "Location & Vehicle"
  | "Personal Characteristics & Demographics"
  | "Civic, Political & Legal"
  | "Education & Employment"
  | "Media & Communications"
  | "Household & Utility"
  | "Miscellaneous Unique Identifiers";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type Regulation =
  | "GDPR"
  | "CCPA"
  | "HIPAA"
  | "GLBA"
  | "FERPA"
  | "State Laws";

export interface PIICategoryInfo {
  id: string;
  category: PIICategory;
  categorySlug: string;
  description: string;
  riskLevel: RiskLevel;
  elementsCount: number;
  regulations: Regulation[];
  icon: string;
  color: string;
}
```

## 🚀 Query Examples

```typescript
// Get all high-risk PII elements
const highRiskPII = await getDocs(
  query(
    collection(db, "pii_elements"),
    where("riskLevel", "==", "high"),
    orderBy("category")
  )
);

// Get PII elements by category
const financialPII = await getDocs(
  query(
    collection(db, "pii_elements"),
    where("category", "==", "Financial & Payment")
  )
);

// Get regulated PII elements
const regulatedPII = await getDocs(
  query(
    collection(db, "pii_elements"),
    where("isRegulated", "==", true),
    where("applicableRegulations", "array-contains", "HIPAA")
  )
);

// Search PII elements
const searchResults = await getDocs(
  query(
    collection(db, "pii_elements"),
    where("element", ">=", searchTerm),
    where("element", "<=", searchTerm + "\uf8ff"),
    limit(20)
  )
);
```

## 📊 Benefits of This Structure

1. **Search & Filter**: Easy to query by category, risk level, regulation
2. **AI Integration**: Detection patterns ready for use
3. **Compliance**: Track which regulations apply to each element
4. **Risk Management**: Risk levels for prioritization
5. **Scalability**: Easy to add new elements and categories
6. **Integration**: Works seamlessly with `state_regulations` collection

## 🔄 Data Migration Strategy

1. **Phase 1**: Import base PII elements from Excel
2. **Phase 2**: Add risk levels and regulations (manual or AI-assisted)
3. **Phase 3**: Add detection patterns
4. **Phase 4**: Add examples and descriptions
5. **Phase 5**: Link to state regulations

## 📈 Usage in Atraiva

This PII elements collection will integrate with:

1. **Breach Detection**: Match data against PII patterns
2. **Risk Assessment**: Calculate exposure based on PII types
3. **Compliance Engine**: Map PII to notification requirements
4. **Data Discovery**: Scan databases for PII elements
5. **Reporting**: Generate PII inventory reports

---

**Recommended Collection Name**: `pii_elements`  
**Structure**: Flat (one document per PII element)  
**Total Documents**: ~200-250 (from 19 rows × 14 categories)  
**Status**: Ready for Import

