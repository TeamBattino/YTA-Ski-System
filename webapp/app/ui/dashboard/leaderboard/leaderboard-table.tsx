'use client';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import type { run, racer } from '@prisma/client'

const columnsSpeed = [
  { key: "racer", label: "RACER" },
  { key: "duration", label: "DURATION" },
  { key: "start_time", label: "START TIME" },
];

const columnsConsistency = [
  { key: "racer", label: "RACER" },
  { key: "consistency", label: "CONSISTENCY" },
];

// helper function to get the value for table cells
const getCellValue = (item: any, columnKey: string) => {
  const value = getKeyValue(item, columnKey);
  return value?.name !== undefined ? value.name : value;
};

// generic leaderboard
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
            <TableCell>{JSON.stringify(getCellValue(item, String(columnKey))).replaceAll('"', '')}</TableCell>
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
  // if 'run' is defined, render LeaderBoardTableSpeed
  if (run) {
    return <LeaderBoardTableSpeed run={run} />;
  }

  // if 'run' is undefined, but 'bruh' is defined, render LeaderBoardTableConsistency
  if (bruh) {
    return <LeaderBoardTableConsistency bruh={bruh} />;
  }

  // if 'bruh' is undefined when 'run' is undefined, show an error
  return <div><p>No data provided</p></div>;
}
