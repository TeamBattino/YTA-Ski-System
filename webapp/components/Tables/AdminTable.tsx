/* eslint-disable @next/next/no-async-client-component */
"use client";
import React, { useCallback } from "react";
import { FormattedRun as Run } from "@/lib/db-helper";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  getKeyValue,
} from "@nextui-org/react";

import { deleteRun } from "@/lib/db-helper";

type Column = {
  key: string;
  label: string;
  allowsSorting: boolean;
};

export type TableComponentProps = {
  columns: Array<Column>;
  list: { items: Iterable<Run> };
  isLoading: boolean;
  tableProps?: React.ComponentProps<typeof Table>;
};

export default function AdminTableComponent({
  columns,
  list,
  isLoading,
  tableProps,
}: TableComponentProps) {
  const deleteRunById = useCallback(async (run_id: string) => {
    try {
      console.log("delete run with id", run_id);
      await deleteRun(run_id);
      console.log("deleted");
      return;
    } catch (error) {
      console.error("Error registering racer: ", error);
      alert("An error occurred. Please try again.: " + error);
    }
  }, []);

  return (
    <Table
      isHeaderSticky
      removeWrapper
      aria-label="Table"
      classNames={{
        base: "max-h-[520px] overflow-scroll border border-gray-200 rounded-xl border-width-",
        table: "",
      }}
      {...tableProps}
    >
      <TableHeader>
        {columns.map((column) => (
          <TableColumn allowsSorting={column.allowsSorting} key={column.key}>
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={list.items}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.run_id ? item.run_id : item.name}>
            {(columnKey) =>
              columnKey == "delete" ? (
                <TableCell>
                  <span onClick={async () => console.log("delete")}>
                    {"delete run"}
                  </span>
                </TableCell>
              ) : (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
