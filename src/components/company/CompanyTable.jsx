import React, { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader,
  Filter,
} from "lucide-react";
import { getCompanies } from "../../services/companyService";

// Giả định: Import SCSS đã thiết kế theo phong cách Cyber-Modern
import styles from "../../assets/styles/companyTable.module.scss";

// =======================
// 1. Cột dữ liệu (Columns Definition)
// =======================

const columnHelper = {
  accessor: (key, header, enableSorting = true, enableFiltering = true) => ({
    accessorKey: key,
    header: () => <span>{header}</span>,
    enableSorting: enableSorting,
    enableFiltering: enableFiltering,
  }),
};

const CompanyTable = ({ onRowClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(""); // State cho tìm kiếm toàn cục (Find)

  // Memoize Columns để tránh re-render không cần thiết
  const columns = useMemo(
    () => [
      // Company ID - Thường không hiển thị, nhưng dùng để truy vết
      columnHelper.accessor("company_id", "ID", false, false),

      columnHelper.accessor("business_name", "Tên Doanh nghiệp", true, true),
      columnHelper.accessor("tax_code", "Mã số thuế", true, true),

      // Type (Loại hình) - Có thể sắp xếp/lọc
      columnHelper.accessor("type", "Loại hình", true, true),

      // Status (Trạng thái) - Có thể sắp xếp/lọc
      columnHelper.accessor("status", "Trạng thái", true, true),

      // Ngày tạo
      columnHelper.accessor("created_at", "Ngày đăng ký", true, false),
    ],
    []
  );

  // =======================
  // 2. Logic gọi API
  // =======================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCompanies();
        // Giả định API trả về data trong response.data
        setData(response.data || []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu công ty:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // =======================
  // 3. Khởi tạo TanStack Table
  // =======================

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 10 }, // Mặc định 10 hàng
    },
  });

  // =======================
  // 4. Giao diện (JSX)
  // =======================

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={32} className={styles.loader} />
        <p>Đang tải dữ liệu từ Blockchain Registry...</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      {/* Thanh công cụ: Tìm kiếm và Filter */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={`Tìm kiếm (${data.length} records)...`}
            className={styles.searchInput}
          />
        </div>
        {/* Có thể thêm các nút lọc nâng cao ở đây */}
        <button className={styles.filterButton}>
          <Filter size={18} /> Lọc Nâng Cao
        </button>
      </div>

      {/* Bảng dữ liệu chính */}
      <table className={styles.companyTable}>
        {/* HEADER */}
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={
                    header.column.getCanSort() ? styles.sortableHeader : ""
                  }
                  onClick={header.column.getToggleSortingHandler()} // Thêm sự kiện sort
                >
                  {header.isPlaceholder ? null : (
                    <div className={styles.headerContent}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {/* Biểu tượng sắp xếp */}
                      {{
                        asc: (
                          <ArrowUpDown
                            size={14}
                            className={styles.sortIconAsc}
                          />
                        ),
                        desc: (
                          <ArrowUpDown
                            size={14}
                            className={styles.sortIconDesc}
                          />
                        ),
                      }[header.column.getIsSorted()] ??
                        (header.column.getCanSort() ? (
                          <ArrowUpDown size={14} className={styles.sortIcon} />
                        ) : null)}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* BODY */}
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  onRowClick && onRowClick(row.original.company_id)
                }>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} data-label={cell.column.columnDef.header}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.noData}>
                Không tìm thấy dữ liệu công ty khớp với tiêu chí tìm kiếm.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* FOOTER - Phân trang (Pagination) */}
      <div className={styles.pagination}>
        <span className={styles.pageInfo}>
          Trang{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </strong>
        </span>
        <div className={styles.pageControls}>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={styles.pageButton}>
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={styles.pageButton}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyTable;
