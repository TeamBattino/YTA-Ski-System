/* eslint-disable @next/next/no-async-client-component */
"use client";
import React from "react";
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
  onDeleteRun: (run_id: string) => Promise<void>;
};

export default function AdminTableComponent({
  columns,
  list,
  isLoading,
  tableProps,
  onDeleteRun
}: TableComponentProps) {

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
                  <span onClick={async () => await onDeleteRun(item.run_id)}>
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
