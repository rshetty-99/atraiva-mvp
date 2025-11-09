const XLSX = require("xlsx");
const fs = require("fs");

// Read the Excel file
const filePath = "C:/Users/rshet/Downloads/PII_elements.xlsx";

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to JSON
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log("=== EXCEL FILE ANALYSIS ===\n");
  console.log(`Sheet Name: ${sheetName}`);
  console.log(`Total Rows: ${data.length}\n`);

  if (data.length > 0) {
    console.log("=== COLUMNS ===");
    const columns = Object.keys(data[0]);
    columns.forEach((col, idx) => {
      console.log(`${idx + 1}. ${col}`);
    });

    console.log("\n=== FIRST 3 ROWS (Sample Data) ===");
    data.slice(0, 3).forEach((row, idx) => {
      console.log(`\nRow ${idx + 1}:`);
      console.log(JSON.stringify(row, null, 2));
    });

    console.log("\n=== DATA TYPES ANALYSIS ===");
    columns.forEach((col) => {
      const sampleValues = data
        .slice(0, 10)
        .map((row) => row[col])
        .filter((v) => v != null);
      const types = [...new Set(sampleValues.map((v) => typeof v))];
      const hasNull = data.some((row) => row[col] == null);
      console.log(`${col}:`);
      console.log(`  - Types: ${types.join(", ")}`);
      console.log(`  - Has null/empty: ${hasNull}`);
      console.log(
        `  - Sample values: ${sampleValues
          .slice(0, 3)
          .map((v) => JSON.stringify(v))
          .join(", ")}`
      );
    });
  }
} catch (error) {
  console.error("Error reading Excel file:", error.message);
}








