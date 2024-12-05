'use client';

import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import type { run, racer } from '@prisma/client';

const columnsSpeed = [
  { key: "rank", label: "RANK" },
  { key: "racername", label: "NAME" },
  { key: "racersite", label: "SITE" },
  { key: "duration", label: "DURATION" },
  { key: "start_time", label: "DATE" },
];

const columnsConsistency = [
  { key: "rank", label: "RANK" },
  { key: "racername", label: "NAME" },
  { key: "racersite", label: "SITE" },
  { key: "consistency", label: "CONSISTENCY" },
];

function rankWithTies(sortedList: any[], key: string) {
  const rankedList = [];
  let currentRank = 1;

  for (let i = 0; i < sortedList.length; i++) {
    const item = sortedList[i];
    const previousItem = sortedList[i - 1];

    if (i > 0 && item[key] === previousItem[key]) {
      rankedList.push({ ...item, rank: currentRank });
    } else {
      rankedList.push({ ...item, rank: currentRank });
      currentRank++;
    }
  }

  return rankedList;
}

const formatTime = (date: Date | null) => {
  if (!date) return null; 

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed, so add 1
  const year = date.getFullYear().toString().slice(-2);
  
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

const formatDuration = (duration: number | null) => {
  if(!duration) return null;
  return duration / 1000;
}
const getCellValue = (item: any, columnKey: string) => {
  const value = columnKey === "racername" || columnKey === "racersite" ? getKeyValue(item, "racer"): getKeyValue(item, columnKey);

  switch (columnKey) {
    case "start_time":
      if (value) {
        return formatTime(new Date(value));
      }
      break;
  
    case "duration":
      if (value) {
        return formatDuration(value) + 's';
      }
      break;
  
    case "consistency":
      if (value) {
        return value + 'ms';
      }
      break;

    case "racername":
      if (value) {
        return value.ldap;
      }
      break;

    case "racersite":
      if (value) {
        return value.location;
      }
      break;
  
    default:
      return value;
  }
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
            <TableCell>{String(getCellValue(item, String(columnKey)) || '').replaceAll('"', '')}</TableCell> // String in case of undefined data
          )}
        </TableRow>
      )}
    </TableBody>
  </Table>
);

const PaginatedTable = ({
  columns,
  items,
  getItemKey,
}: {
  columns: { key: string; label: string }[];
  items: any[];
  getItemKey: (item: any) => string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get paginated items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <LeaderBoardTable columns={columns} items={currentItems} getItemKey={getItemKey} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export function LeaderBoardTableSpeed({ run }: { run: run[] }) {
  const runsWithRank = rankWithTies(run, 'duration');
  return <PaginatedTable columns={columnsSpeed} items={runsWithRank} getItemKey={(item) => item.run_id} />;
}

export function LeaderBoardTableConsistency({ bruh }: { bruh: { racer: racer; consistency: number }[] }) {
  const consistencyWithRank = rankWithTies(bruh, 'consistency');
  return <PaginatedTable columns={columnsConsistency} items={consistencyWithRank} getItemKey={(item) => item.racer.racer_id} />;
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
