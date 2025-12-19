"use client";
import { useAsyncList } from "@react-stately/data";
import AdminTableComponent from "./AdminTable";
import { getRecentRuns } from "@/lib/db-helper";
import { Key, useCallback, useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { SearchIcon } from "../icons/SearchIcon";
import moment from "moment";
import { redirect } from "next/navigation";
import { run as Run, race as Race } from "@/src/generated/client";
import { FormattedRun, deleteRun } from "@/lib/db-helper";

type StringFormattedRun = {
  name: string;
  duration: string;
  location: string;
  start_time: string;
  ski_pass: string;
  race_id: string;
  ldap: string;
  run_id: string;
};

type RunsTableProp = {
  race: Race;
};

export default function AdminRecentRunsTable({ race }: RunsTableProp) {
  const columns = [
    { key: "name", label: "Name", allowsSorting: true },
    { key: "duration", label: "Duration", allowsSorting: true },
    { key: "location", label: "Location", allowsSorting: true },
    { key: "start_time", label: "Date", allowsSorting: true },
    { key: "delete", label: "Delete", allowsSorting: false },
  ];

  const locations = ["ALL", "ZRH", "WAW", "US", "DE"];

  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const list = useAsyncList<StringFormattedRun>({
    async load() {
      const topRuns = await getRecentRuns(race.race_id);
      const formattedRuns = topRuns.map((run: Run) => {
        if (run.duration) {
          const durationMilliseconds = run.duration / 10;
          const duration = moment.duration(durationMilliseconds);
          const formattedDuration = moment
            .utc(duration.asMilliseconds())
            .format("mm:ss.SSSS");
          return {
            ...run,
            duration: formattedDuration,
            start_time: moment(run.start_time).format("HH:mm D/M/YY"),
          } as unknown as StringFormattedRun;
        }
      });
      const nonNullFormattedRuns = formattedRuns.filter(
        (run): run is StringFormattedRun => run !== undefined
      );

      setIsLoading(false);
      return {
        items: nonNullFormattedRuns,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: StringFormattedRun, b: StringFormattedRun) => {
          if (sortDescriptor.column === "start_time") {
            const first = moment(
              a[sortDescriptor.column as keyof StringFormattedRun],
              "HH:mm D/M/YY"
            );
            const second = moment(
              b[sortDescriptor.column as keyof StringFormattedRun],
              "HH:mm D/M/YY"
            );
            let cmp = first.isBefore(second) ? -1 : 1;

            if (sortDescriptor.direction === "descending") {
              cmp *= -1;
            }

            return cmp;
          } else if (sortDescriptor.column === "duration") {
            const parseDuration = (durationString: string): number => {
              const [minutes, secondsAndMilliseconds] =
                durationString.split(":");
              const [seconds, millisecondsPart] =
                secondsAndMilliseconds.split(".");
              const minutesInSeconds = parseInt(minutes, 10) * 60;
              const secondsValue = parseInt(seconds, 10);
              let millisecondsValue = 0;

              if (millisecondsPart) {
                // Treat the milliseconds part as a fraction of a second
                const multiplier = Math.pow(10, 3 - millisecondsPart.length);
                millisecondsValue = parseInt(millisecondsPart, 10) * multiplier;
              }

              return (
                (minutesInSeconds + secondsValue) * 1000 + millisecondsValue
              );
            };

            const durationA = parseDuration(a.duration);
            const durationB = parseDuration(b.duration);
            let cmp = durationA < durationB ? -1 : 1;

            if (sortDescriptor.direction === "descending") {
              cmp *= -1;
            }
            return cmp;
          } else {
            const first = a[sortDescriptor.column as keyof StringFormattedRun];
            const second = b[sortDescriptor.column as keyof StringFormattedRun];
            let cmp =
              (parseInt(first as string) || first) <
              (parseInt(second as string) || second)
                ? -1
                : 1;

            if (sortDescriptor.direction === "descending") {
              cmp *= -1;
            }

            return cmp;
          }
        }),
      };
    },
  });

  const onDeleteRun = useCallback(
    async (run_id: string) => {
      console.log("delete run with id", run_id);
      await deleteRun(run_id);
      console.log("deleted");
      await list.reload();
    },
    [list]
  );

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setSearchValue(value);
    } else {
      setSearchValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setSearchValue("");
  }, []);

  const filterList = useMemo(() => {
    return list.items.filter((item) => {
      if (race && item.race_id == race.race_id) {
        if (selectedLocation === "ALL") {
          return item.name.toLowerCase().includes(searchValue.toLowerCase());
        } else {
          return (
            item.name.toLowerCase().includes(searchValue.toLowerCase()) &&
            item.location === selectedLocation
          );
        }
      }
    });
  }, [list.items, race, searchValue, selectedLocation]);

  const onRowClick = (item: Key) => {
    const personToView = list.items.find((i) => i.name === item);
    if (personToView) {
      redirect(`/dashboard/leaderboard/${personToView?.ski_pass}`);
    }
  };

  return (
    <div>
      <div className="flex flex-row gap-2 py-2">
        <Input
          isClearable
          className="w-full"
          placeholder="Search by name..."
          startContent={<SearchIcon />}
          value={searchValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize" variant="bordered">
              {selectedLocation}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={selectedLocation}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(keys) => {
              if (keys.currentKey) setSelectedLocation(keys.currentKey);
            }}
          >
            {locations.map((location) => (
              <DropdownItem key={location}>{location}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <AdminTableComponent
        columns={columns}
        onDeleteRun={onDeleteRun}
        list={{ items: filterList as Iterable<FormattedRun> }}
        isLoading={isLoading}
        tableProps={{
          sortDescriptor: list.sortDescriptor || {
            column: "start_time",
            direction: "descending",
          },
          onSortChange: list.sort,
          onRowAction: onRowClick,
        }}
      />
    </div>
  );
}
