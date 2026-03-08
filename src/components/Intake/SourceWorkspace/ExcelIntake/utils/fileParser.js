import { PYTHON_BASE } from "../../../../../constants/api";

/**
 * Upload original file (XLSX / CSV / JSON)
 * ONLY accepts File object
 */
export const parseFile = async (file) => {
  if (!(file instanceof File)) {
    console.error("parseFile expects a File, got:", file);
    throw new Error("parseFile() must be called with a File object");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${PYTHON_BASE}/api/ingest-file`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Backend error:", err);
    throw new Error("File ingest failed");
  }

  return await response.json();
};

/**
 * Send CLEANED data (after Start / End selection)
 * ONLY accepts array of objects
 */
export const parseCleanData = async (records) => {
  if (!Array.isArray(records)) {
    console.error("parseCleanData expects array, got:", records);
    throw new Error("parseCleanData() must be called with an array");
  }

  try {
    const response = await fetch(`${PYTHON_BASE}/api/ingest-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(records),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Backend error:", errText);
      throw new Error(`Backend returned ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("FULL ERROR:", err);
    throw err;
  }
};

export const parseCleanJSON = async (records) => {
  const response = await fetch(`${PYTHON_BASE}/api/parse-json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(records),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error(err);
    throw new Error("JSON parse failed");
  }

  return await response.json();
};
