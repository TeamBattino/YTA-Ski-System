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
  Button,
} from "@nextui-org/react";
import {
  deleteRun,
} from "@/lib/db-helper";

import { DeleteIcon } from "@/components/common/icons/lucide-delete";


type Column = {
  key: string;
  label: string;
  allowsSorting: boolean;
};

export type TableComponentProps = {
  columns: Array<Column>;
  list: { items: Iterable<any> };
  isLoading: boolean;
  tableProps?: React.ComponentProps<typeof Table>;
};

export default function AdminTableComponent({
  columns,
  list,
  isLoading,
  tableProps,
}: TableComponentProps) {
  async function deleteRunById(
    run_id: string
  ): Promise<React.MouseEventHandler<HTMLButtonElement> | undefined> {
    try {
      await deleteRun(run_id);
      return;
    } catch (error) {
      console.error("Error registering racer: ", error);
      alert("An error occurred. Please try again.: " + error);
    }
  }

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
          <>
            <TableRow key={item.run_id ? item.run_id : item.name}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
            <Button onClick={deleteRunById(item.run_id)}>
              <DeleteIcon />
            </Button>
          </>
        )}
      </TableBody>
    </Table>
  );
}
