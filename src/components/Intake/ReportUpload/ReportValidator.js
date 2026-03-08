export const validateFile = (file) => {
  if (!file) return "No file selected";

  const allowed = ["xlsx", "xls", "csv", "json"];
  const ext = file.name.split(".").pop().toLowerCase();

  if (!allowed.includes(ext)) {
    return "Unsupported file format";
  }

  return null;
};
