import { create } from "zustand";

export const useFileStore = create((set) => ({
  file: null,
  rows: [],
  mappings: [],
  conflicts: [],
  sheetNames: [],
  sheets: {},
  activeSheet: null,

  setFile: (file) => set({ file }),
  setRows: (rows) => set({ rows }),
  setMappings: (mappings) => set({ mappings }),
  setConflicts: (conflicts) => set({ conflicts }),
  setSheets: (data) =>
    set({
      sheetNames: data.sheetNames,
      sheets: data.sheets,
      activeSheet: data.sheetNames[0] || null,
    }),

  setActiveSheet: (name) => set({ activeSheet: name }),

  reset: () =>
    set({
      file: null,
      rows: [],
      mappings: [],
      conflicts: [],
      sheetNames: [],
      sheets: {},
      activeSheet: null,
    }),
}));
