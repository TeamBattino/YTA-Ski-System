'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import type { run, racer } from '@prisma/client';

const columnsSpeed = [
  { key: "racer", label: "RACER" },
  { key: "duration", label: "DURATION" },
  { key: "start_time", label: "DATE" },
];

const columnsConsistency = [
  { key: "racer", label: "RACER" },
  { key: "consistency", label: "CONSISTENCY" },
];


const formatTime = (date: Date | null) => {
  if (!date) return "00:00:00 01:01:70"; 

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed, so add 1
  const year = date.getFullYear().toString().slice(-2);
  
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

const getCellValue = (item: any, columnKey: string) => {
  const value = getKeyValue(item, columnKey);


  if (columnKey === "start_time" && value) {
    return formatTime(new Date(value));
  }

  return value?.name !== undefined ? value.name : value;
};

const LeaderBoardTable = ({
  columns,
  items,
  getItemKey
}: {
  columns: { key: string; label: string }[];
  items: any[];
  getItemKey: (item: any) => string;
}) => (
  <Table isStriped>
    <TableHeader columns={columns}>
      {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
    </TableHeader>
    <TableBody items={items}>
      {(item) => (
        <TableRow key={getItemKey(item)}>
          {(columnKey) => (
            <TableCell>{String(getCellValue(item, String(columnKey)) || '').replaceAll('"', '')}</TableCell>
          )}
        </TableRow>
      )}
    </TableBody>
  </Table>
);

export function LeaderBoardTableSpeed({ run }: { run: run[] }) {
  return <LeaderBoardTable columns={columnsSpeed} items={run} getItemKey={(item) => item.run_id} />;
}

export function LeaderBoardTableConsistency({ bruh }: { bruh: { racer: racer; consistency: number }[] }) {
  return <LeaderBoardTable columns={columnsConsistency} items={bruh} getItemKey={(item) => item.racer.racer_id} />;
}

export default function LeaderboardTable({ run, bruh }: { run?: run[]; bruh?: { racer: racer; consistency: number }[] }) {
  if (run) {
    return <LeaderBoardTableSpeed run={run} />;
  }

  if (bruh) {
    return <LeaderBoardTableConsistency bruh={bruh} />;
  }

  return <div><p>No data provided</p></div>;
}
