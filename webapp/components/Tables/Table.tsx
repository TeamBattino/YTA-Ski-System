"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
} from "@nextui-org/react";

import {FormattedRun} from '@/lib/db-helper';

type Column = {
  key: string,
  label: string,
  allowsSorting: boolean,
}

export type TableComponentProps = {
  columns: Array<Column>;
  list: { items: Iterable<FormattedRun> };
  isLoading: boolean;
  tableProps?: React.ComponentProps<typeof Table>;
};

export default function TableComponent({ columns, list, isLoading, tableProps }: TableComponentProps) {
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
          <TableColumn allowsSorting={column.allowsSorting} key={column.key}>{column.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        items={list.items}
        loadingContent={<Spinner label="Loading..." />}
      >
        {(item) => (
          <TableRow key={item.run_id ? item.run_id : item.name}>

            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
