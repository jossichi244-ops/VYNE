// src/services/schemaService.js
import { API_URL } from "../constants";

export async function uploadFileToServer(file) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_URL}/api/parse-file`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Upload failed: " + text);
  }

  return res.json(); // { schema, preview }
}
