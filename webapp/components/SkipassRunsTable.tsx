"use client";
import { useAsyncList } from "react-stately";
import TableComponent from "./Table";
import { Consistency, getAllConsistency, getRacerRunsBySkicard, getTopRuns, Run } from "@/lib/db-helper";
import { useCallback, useMemo, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { SearchIcon } from "./icons/SearchIcon";

type SkipassRunsTableProps = {
    ski_pass: string;
}

export default function SkipassRunsTable({ski_pass}: SkipassRunsTableProps) {
    const columns = [
        { key: "name", label: "Name", allowsSorting: true },
        { key: "duration", label: "Duration", allowsSorting: true },
        { key: "location", label: "Location", allowsSorting: true },
    ];

    const locations = ["ALL", "ZRH", "WAW", "US", "DE"];

    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("ALL");
    const hasSearch = Boolean(searchValue);
    let list = useAsyncList<Run>({
        async load() {
            const runs = await getRacerRunsBySkicard(ski_pass);
            setIsLoading(false);
            return {
                items: runs,
            };
        },
        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a: Run, b: Run) => {
                    let first = a[sortDescriptor.column as keyof Run];
                    let second = b[sortDescriptor.column as keyof Run];
                    let cmp = (parseInt(first as string) || first) < (parseInt(second as string) || second) ? -1 : 1;

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
            if (selectedLocation === "ALL") {
                return item.name.toLowerCase().includes(searchValue.toLowerCase());
            } else {
                return item.name.toLowerCase().includes(searchValue.toLowerCase()) && item.location === selectedLocation;
            }
        });
    }, [list.items, searchValue, selectedLocation]);

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
                        <Button
                            className="capitalize" variant="bordered"
                        >{selectedLocation}</Button>
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
                            <DropdownItem key={location}>
                                {location}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <TableComponent
                columns={columns}
                list={{ items: filterList }}
                isLoading={isLoading}
                tableProps={{
                    sortDescriptor: list.sortDescriptor || { column: 'duration', direction: 'ascending' },
                    onSortChange: list.sort,
                }}
            />
        </div>
    );
}