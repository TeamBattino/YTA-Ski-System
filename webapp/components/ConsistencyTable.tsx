"use client";
import { useAsyncList } from "react-stately";
import TableComponent from "./Table";
import { Consistency, getConsistency } from "@/lib/db-helper";
import { useCallback, useMemo, useState } from "react";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { SearchIcon } from "./icons/SearchIcon";

export default function ConsistencyTable() {
    const columns = [
        { key: "name", label: "Name", allowsSorting: true },
        { key: "consistency", label: "Consistency", allowsSorting: true },
        { key: "location", label: "Location", allowsSorting: true },
    ];

    const locations = ["ALL", "ZRH", "WAW", "US", "DE"];

    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("ALL");
    const hasSearch = Boolean(searchValue);
    let list = useAsyncList<Consistency>({
        async load({ cursor }) {
            const page = cursor ? parseInt(cursor) : 0;
            const consistency = await getConsistency(page);
            console.log("consistency", consistency);
            setIsLoading(false);
            return {
                items: consistency,
                cursor: (page + 1).toString()
            };
        },
        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a: Consistency, b: Consistency) => {
                    let first = a[sortDescriptor.column as keyof Consistency];
                    let second = b[sortDescriptor.column as keyof Consistency];
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
            <Input
                isClearable
                className="w-full sm:max-w-[44%]"
                placeholder="Search by name..."
                startContent={<SearchIcon />}
                value={searchValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
            />
            <Autocomplete className="max-w-xs" label="Select an animal">
                {locations.map((location) => (
                    <AutocompleteItem key={location}>{location}</AutocompleteItem>
                ))}
            </Autocomplete>
            <TableComponent
                columns={columns}
                list={{ items: filterList }}
                isLoading={isLoading}
                tableProps={{
                    sortDescriptor: list.sortDescriptor,
                    onSortChange: list.sort,
                }}
            />
        </div>
    );
}