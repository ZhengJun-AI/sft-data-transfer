import * as React from "react"
import { EditableCell } from "./editable-cell"
import { Checkbox } from "./checkbox"
import { Button } from "./button"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowSelect?: (selectedRows: TData[]) => void
  onDataChange?: (updatedData: TData[]) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowSelect,
  onDataChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})

  const handleCellValueChange = React.useCallback((rowIndex: number, columnId: string, value: any) => {
    const updatedData = [...data]
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [columnId]: value
    }
    onDataChange?.(updatedData)
  }, [data, onDataChange])

  const table = useReactTable({
    data,
    initialState: {
      pagination: {
        pageSize: 4
      }
    },
    columns: [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex gap-2">
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select current page"
            />
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns.map(col => ({
        ...col,
        cell: ({ row, column }) => (
          <EditableCell
            value={row.getValue(column.id)}
            row={row}
            column={column}
            onValueChange={(value) => handleCellValueChange(row.index, column.id, value)}
          />
        )
      })),
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
  })

  React.useEffect(() => {
    if (onRowSelect && Object.keys(rowSelection).length > 0) {
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
      onRowSelect(selectedRows)
    }
  }, [rowSelection])

  return (
    <div className="rounded-md border">
      <div className="flex items-center py-4 px-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} 项已选择，共 {table.getFilteredRowModel().rows.length} 项（左侧复选框：当前页选择，右侧复选框：全局选择）
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">每页显示</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
            className="h-8 w-16 rounded-md border border-input bg-transparent px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {[4, 8, 16, 32].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {headerGroup.headers.map((header) => {
                  const maxContentLength = table.getRowModel().rows.reduce((max, row) => {
                    const value = row.getValue(header.column.id);
                    const content = typeof value === 'object' ? JSON.stringify(value) : String(value);
                    return Math.max(max, content.length);
                  }, header.column.columnDef.header?.toString().length || 0);
                  
                  const minWidth = 100;
                  const maxWidth = 400;
                  const charWidth = 8;
                  const calculatedWidth = Math.min(maxWidth, Math.max(minWidth, maxContentLength * charWidth));
                  
                  return (
                    <th 
                      key={header.id} 
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                      style={{ width: header.column.id === 'select' ? 'auto' : `${calculatedWidth}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                        key={cell.id}
                        className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                        style={{
                          maxWidth: '400px',
                          minWidth: '100px',
                          height: '150px'
                        }}
                    >
                        <div className="min-h-[4rem] w-full h-full">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                    </td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          上一页
        </Button>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">第</span>
          <input
            type="number"
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="w-16 rounded-md border border-input bg-transparent px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <span className="text-sm font-medium">页，共 {table.getPageCount()} 页</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          下一页
        </Button>
      </div>
    </div>
  )
}