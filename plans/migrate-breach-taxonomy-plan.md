# Migrate Breach Trigger Taxonomy Plan

1. Parse the legacy JSON export (single document containing all taxonomy data).
2. Transform each category/element entry into individual node records with normalized fields (`label`, `category`, optional `parentId`, keywords, metadata).
3. Write the normalized nodes into Firestore collection `breach_trigger_taxonomies`, preserving hierarchy and metadata.
