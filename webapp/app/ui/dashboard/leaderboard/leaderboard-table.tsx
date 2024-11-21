'use client';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import type { run, racer } from '@prisma/client'


export function LeaderBoardTableSpeed({
  run
}: {
  run: run[];
}){

  const columns = [
    {
      key: "racer",
      label: "RACER",
    },
    {
      key: "duration",
      label: "DURATION",
    },
    {
      key: "start_time",
      label: "START TIME",
    },
  ];

  return (
    <Table isStriped>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={run}>
        {(item) => (
          <TableRow key={item.run_id}>
            {(columnKey) => <TableCell>{JSON.stringify(getKeyValue(item, columnKey).name != undefined ? getKeyValue(item, columnKey).name : getKeyValue(item, columnKey) ).replaceAll("\"", "")}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}



export async function LeaderBoardTableConsistency({bruh} : {bruh: {racer : racer, consistency : number}[]}){
  const columns = [
    {
      key: "racer",
      label: "RACER",
    },
    {
      key: "consistency",
      label: "CONSISTENCY",
    },
  ];
  return (
    <Table isStriped>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={bruh}>
        {(item) => (
          <TableRow key={item.racer.racer_id}>
          {(columnKey) => <TableCell>{JSON.stringify(getKeyValue(item, columnKey).name != undefined ? getKeyValue(item, columnKey).name : getKeyValue(item, columnKey) ).replaceAll("\"", "")}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function LeaderboardTable({run, bruh} : {run? : run[], bruh? : {racer : racer, consistency : number}[]}) {
  if (run == null){
    if (bruh == null){
      return (
        <div><p>no data provided</p></div>
      );
    }
    else {
      return (<LeaderBoardTableConsistency bruh={bruh}/>);
    }
  } else {
    return (<LeaderBoardTableSpeed run={run}/>);
  }
}