import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/table";

const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    time: "9000",
    rank: 1,
  },
  {
    key: "2",
    name: "Zoey Lang",
    time: "8000",
    rank: 2,
  },
  {
    key: "3",
    name: "Jane Fisher",
    time: "7000",
    rank: 3,
  },
  {
    key: "4",
    name: "William Howard",
    time: "6000",
    rank: 4,
  },
];

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "time",
    label: "TIME",
  },
  {
    key: "rank",
    label: "RANK",
  },
];

export default function LeaderboardTable() {
  
  return (
    <Table isStriped aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}