"use client";
import { useAsyncList } from "react-stately";
import TableComponent from "./Table";
import { getRecentRuns } from "@/lib/db-helper";
import { run as Run, race as Race } from "@/src/generated/client";
import { useCallback, useMemo, useState } from "react";
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
// import { redirect } from "next/navigation";

type FormattedRun = {
  run_id: string;
  name: string;
  duration: string;
  location: string;
  start_time: string;
  ski_pass: string;
};

export default function RecentRunsTable(race: Race) {
  const columns = [
    { key: "name", label: "Name", allowsSorting: true },
    { key: "duration", label: "Duration", allowsSorting: true },
    { key: "location", label: "Location", allowsSorting: true },
    { key: "start_time", label: "Date", allowsSorting: true },
  ];

  const locations = ["ALL", "ZRH", "WAW", "US", "DE"];

  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const list = useAsyncList<FormattedRun>({
    async load() {
      const recentRuns = await getRecentRuns(race.race_id);
      const formattedRuns = recentRuns.map((run: Run) => {
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
          };
        }
      });
      setIsLoading(false);
      return {
        items: formattedRuns,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: FormattedRun, b: FormattedRun) => {
          if (sortDescriptor.column === "start_time") {
            const first = moment(
              a[sortDescriptor.column as keyof FormattedRun],
              "HH:mm D/M/YY"
            );
            const second = moment(
              b[sortDescriptor.column as keyof FormattedRun],
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
            const first = a[sortDescriptor.column as keyof FormattedRun];
            const second = b[sortDescriptor.column as keyof FormattedRun];
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
      if (selectedLocation === "ALL") {
        return item.name.toLowerCase().includes(searchValue.toLowerCase());
      } else {
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) &&
          item.location === selectedLocation
        );
      }
    });
  }, [list.items, searchValue, selectedLocation]);

  /*const onRowClick = (item: Key) => {
    const personToView = list.items.find((i) => i.run_id === item);
    personToView &&
      redirect(`/dashboard/leaderboard/${personToView?.ski_pass}`);
  };*/

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
              keys.currentKey && setSelectedLocation(keys.currentKey);
            }}
          >
            {locations.map((location) => (
              <DropdownItem key={location}>{location}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
      <TableComponent
        columns={columns}
        list={{ items: filterList }}
        isLoading={isLoading}
        tableProps={{
          sortDescriptor: list.sortDescriptor || {
            column: "start_time",
            direction: "descending",
          },
          onSortChange: list.sort,
          // onRowAction: onRowClick,
        }}
      />
    </div>
  );
}
