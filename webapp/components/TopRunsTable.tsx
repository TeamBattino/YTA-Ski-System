"use client";
import { useAsyncList } from "react-stately";
import TableComponent from "./Table";
import { Consistency, getAllConsistency, getTopRuns, Run } from "@/lib/db-helper";
import { Key, useCallback, useMemo, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { SearchIcon } from "./icons/SearchIcon";
import moment from "moment";
import { redirect } from "next/navigation";

type FormattedRun = {
    name: string,
    duration: string,
    location: string,
    start_time: string,
    ski_pass: string,
}

export default function TopRunsTable() {
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
    const hasSearch = Boolean(searchValue);
    let list = useAsyncList<FormattedRun>({
        async load() {
            const topRuns = await getTopRuns();
            const formattedRuns = topRuns.map((run: Run) => {
                return {
                    ...run,
                    duration: moment.utc(run.duration * 1000).format('HH:mm:ss'),
                    start_time: moment(run.start_time).format('YYYY-MM-DD'),
                };
            }
            );
            setIsLoading(false);
            return {
                items: formattedRuns,
            };
        },
        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a: FormattedRun, b: FormattedRun) => {
                    let first = a[sortDescriptor.column as keyof FormattedRun];
                    let second = b[sortDescriptor.column as keyof FormattedRun];
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

    const onRowClick = (item: Key) => {
        const personToView = list.items.find((i) => i.name === item);
        personToView && redirect(`/dashboard/leaderboard/${personToView?.ski_pass}`);
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
                    onRowAction: onRowClick,
                }}
            />
        </div>
    );
}