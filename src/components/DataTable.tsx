// DataTable.tsx
import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  OnChangeFn,
  Row,
  SortingState,
} from "@tanstack/react-table";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Box,
  Button,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { fetchData, type Person } from "../makeData";
import AddPersonModal from "./AddPersonModal";
import "../index.css";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personSchema, type PersonFormValues } from "../validator";

const FETCH_SIZE = 50;

const DataTable = () => {
  // --- State ---
  const [localData, setLocalData] = React.useState<Person[]>([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [editingCell, setEditingCell] = React.useState<{
    rowId: string;
    columnId: string;
  } | null>(null);
  const [editedData, setEditedData] = React.useState<
    Record<string, Partial<Person>>
  >({});

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // react-hook-form
  const { control, handleSubmit, setValue } = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: { name: "", language: "English", version: 1 },
  });

  const startEdit = (rowId: string, columnId: string, defaultValue: any) => {
    setEditingCell({ rowId, columnId });
    setValue(columnId as keyof PersonFormValues, defaultValue);
  };

  const cancelEdit = () => setEditingCell(null);

  const commitEdit = (rowId: string, values: Partial<PersonFormValues>) => {
    setEditedData((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], ...values },
    }));
    setEditingCell(null);
  };

  // --- Table Columns ---
  const columns = React.useMemo<ColumnDef<Person>[]>(() => {
    return [
      {
        id: "stt",
        header: "STT",
        size: 80,
        cell: ({ row }) => row.index + 1,
      },
      { accessorKey: "id", header: "ID", size: 180 },
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
        cell: ({ row, getValue }) => {
          const rowId = row.id;
          const currentValue =
            editedData[rowId]?.name ?? (getValue() as string);

          if (
            editingCell?.rowId === rowId &&
            editingCell?.columnId === "name"
          ) {
            return (
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    autoFocus
                    size="small"
                    variant="standard"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onBlur={() =>
                      handleSubmit((values) =>
                        commitEdit(rowId, { name: values.name })
                      )()
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit((values) =>
                          commitEdit(rowId, { name: values.name })
                        )();
                      } else if (e.key === "Escape") {
                        cancelEdit();
                      }
                    }}
                  />
                )}
              />
            );
          }

          return (
            <div onClick={() => startEdit(rowId, "name", currentValue)}>
              {currentValue}
            </div>
          );
        },
      },
      {
        accessorKey: "language",
        header: "Language",
        size: 200,
        cell: ({ row, getValue }) => {
          const rowId = row.id;
          const currentValue =
            editedData[rowId]?.language ?? (getValue() as string);

          if (
            editingCell?.rowId === rowId &&
            editingCell?.columnId === "language"
          ) {
            return (
              <Controller
                name="language"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      autoFocus
                      size="small"
                      onBlur={() =>
                        handleSubmit((values) =>
                          commitEdit(rowId, { language: values.language })
                        )()
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit((values) =>
                            commitEdit(rowId, { language: values.language })
                          )();
                        } else if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                    >
                      {["English", "Sindhi", "Vietnamese"].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText error>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            );
          }

          return (
            <div onClick={() => startEdit(rowId, "language", currentValue)}>
              {currentValue}
            </div>
          );
        },
      },
      { accessorKey: "bio", header: "Bio", size: 600 },
      {
        accessorKey: "version",
        header: "Version",
        size: 100,
        cell: ({ row, getValue }) => {
          const rowId = row.id;
          const currentValue =
            editedData[rowId]?.version ?? (getValue() as number);

          if (
            editingCell?.rowId === rowId &&
            editingCell?.columnId === "version"
          ) {
            return (
              <Controller
                name="version"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    autoFocus
                    size="small"
                    variant="standard"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    value={field.value ?? ""} 
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? "" : Number(e.target.value);
                      field.onChange(value);
                    }}
                    onBlur={() =>
                      handleSubmit((values) =>
                        commitEdit(rowId, { version: values.version })
                      )()
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit((values) =>
                          commitEdit(rowId, { version: values.version })
                        )();
                      } else if (e.key === "Escape") {
                        cancelEdit();
                      }
                    }}
                  />
                )}
              />
            );
          }

          return (
            <div onClick={() => startEdit(rowId, "version", currentValue)}>
              {currentValue}
            </div>
          );
        },
      },
    ];
  }, [editingCell, editedData, control]);

  // --- React Query Infinite Scroll ---
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ["people", sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const start = (pageParam as number) * FETCH_SIZE;
      return fetchData(start, FETCH_SIZE, sorting);
    },
    initialPageParam: 0,
    getNextPageParam: (_lastPage, pages) => pages.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  // --- Infinite Scroll handler ---
  const fetchMoreOnBottomReached = React.useCallback(
    (container?: HTMLDivElement | null) => {
      if (container) {
        const { scrollHeight, scrollTop, clientHeight } = container;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 500;
        if (isNearBottom && !isFetching && totalFetched < totalDBRowCount) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  // --- Data merge ---
  const mergedData = React.useMemo(() => {
  const merged = [...localData, ...flatData];
  return merged.map((row) => {
    if (editedData[row.id]) {
      return { ...row, ...editedData[row.id] }; 
    }
    return row;
  });
}, [localData, flatData, editedData]);

  // --- Table setup ---
  const table = useReactTable({
    data: mergedData,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    overscan: 5,
  });

  // --- Sorting handler ---
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    rowVirtualizer.scrollToIndex?.(0);
  };

  table.setOptions((prev) => ({
    ...prev,
    onSortingChange: handleSortingChange,
  }));

  if (isLoading) return <>Loading...</>;

  return (
    <Box className="app">
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => setOpenModal(true)}
          >
            Add Person
          </Button>
          <span>
            ({flatData.length} of {totalDBRowCount} rows fetched)
          </span>
        </Box>

        <div
          className="container"
          ref={tableContainerRef}
          onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
          style={{ overflow: "auto", position: "relative", height: "600px" }}
        >
          <table style={{ display: "grid" }}>
            <thead
              style={{ display: "grid", position: "sticky", top: 0, zIndex: 1 }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  style={{ display: "flex", width: "100%" }}
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ display: "flex", width: header.getSize() }}
                    >
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" && " 🔼"}
                        {header.column.getIsSorted() === "desc" && " 🔽"}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody
              style={{
                display: "grid",
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = table.getRowModel().rows[
                  virtualRow.index
                ] as Row<Person>;
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={(node) => rowVirtualizer.measureElement(node)}
                    style={{
                      display: "flex",
                      position: "absolute",
                      transform: `translateY(${virtualRow.start}px)`,
                      width: "100%",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          display: "flex",
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {isFetching && <div>Fetching More...</div>}

        <AddPersonModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onAdd={(person) => {
            const newPerson: Person = { id: crypto.randomUUID(), ...person };
            setLocalData((prev) => [newPerson, ...prev]);
          }}
        />
      </Box>
    </Box>
  );
};

export default DataTable;
