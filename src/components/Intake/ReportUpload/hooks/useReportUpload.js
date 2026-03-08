import { validateFile } from "../ReportValidator";
import { previewExcelFull } from "../../SourceWorkspace/ExcelIntake/utils/previewParser";
import { parseCleanData } from "../../SourceWorkspace/ExcelIntake/utils/fileParser";
import { useReportContext } from "../ReportContext";

export default function useReportUpload() {
  const { setDataset, setLoading, setError } = useReportContext();

  const handleUpload = async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await previewExcelFull(file);
      const firstSheet = result.sheetNames[0];
      const previewRows = result.sheets[firstSheet];

      const headers = previewRows[0];
      const dataRows = previewRows.slice(1);

      const records = dataRows.map((row) =>
        Object.fromEntries(headers.map((h, i) => [h, row[i]])),
      );

      const analysis = await parseCleanData(records);

      setDataset({
        schema: analysis.schema,
        data: analysis.preview,
        metadata: analysis.file_summary,
      });
    } catch (err) {
      setError("Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  return { handleUpload };
}
