'use client';

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
import type { run } from '@prisma/client'
const columns = [
  {
    key: "racer_id",
    label: "RACER_ID",
  },
  {
    key: "duration",
    label: "DURATION",
  },
  {
    key: "date",
    label: "DATE",
  },
];

export default function LeaderboardTable({
  run,
}: {
  run: run[];
}){
  return (
    <Table isStriped>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={run}>
        {(item) => (
          <TableRow key={item.run_id}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}