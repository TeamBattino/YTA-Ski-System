"use client";
import { useAsyncList } from "react-stately";
import TableComponent from "./Table";
import { Consistency, getAllConsistency } from "@/lib/db-helper";
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
import { race as Race } from '@/src/generated/prisma/client';


export default function ConsistencyTable(race: Race) {
  const columns = [
    { key: "name", label: "Name", allowsSorting: true },
    { key: "consistency", label: "Consistency", allowsSorting: true },
    { key: "location", label: "Location", allowsSorting: true },
  ];

  const locations = ["ALL", "ZRH", "WAW", "US", "DE"];

  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const list = useAsyncList<Consistency>({
    async load() {
      const consistency = await getAllConsistency(race.race_id);
      
      setIsLoading(false);
      consistency.map((run: Consistency) => {
        run.consistency = run.consistency / 10000;
      });
      return {
        items: consistency,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a: Consistency, b: Consistency) => {
          const first = a[sortDescriptor.column as keyof Consistency];
          const second = b[sortDescriptor.column as keyof Consistency];
          let cmp =
            (parseInt(first as string) || first) <
            (parseInt(second as string) || second)
              ? -1
              : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
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
            column: "consistency",
            direction: "ascending",
          },
          onSortChange: list.sort,
        }}
      />
      <span className="px-6 text-xs">
        *Consistency is shown in seconds, to 10^(-4) precision taken from your
        last two runs.
      </span>
    </div>
  );
}
