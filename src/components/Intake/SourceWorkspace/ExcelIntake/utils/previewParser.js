import * as XLSX from "xlsx";
import Papa from "papaparse";

// ===== PREVIEW FULL EXCEL (ALL SHEETS) =====
export const previewExcelFull = async (file) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  const sheetNames = workbook.SheetNames;
  const sheets = {};

  sheetNames.forEach((name) => {
    const worksheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
    });
    sheets[name] = rows;
  });

  return { sheetNames, sheets };
};

// ===== PREVIEW CSV / JSON (LIMIT ROWS) =====
export const previewFileLocal = async (file, maxRows = 1000) => {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "csv") {
    return new Promise((resolve) => {
      Papa.parse(file, {
        preview: maxRows,
        skipEmptyLines: false,
        complete: (res) => resolve(res.data),
      });
    });
  }

  throw new Error("Preview not supported for this file type");
};
