"use client";
import { useAsyncList } from "react-stately";
import TableComponent from "./Table";
import { Consistency, getAllConsistency, getRacerRunsBySkicard as getRacerRunsBySkipass, getTopRuns, Run } from "@/lib/db-helper";
import { useCallback, useMemo, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { SearchIcon } from "./icons/SearchIcon";
import { li } from "framer-motion/client";
import moment from "moment";

type SkipassRunsTableProps = {
    ski_pass: string;
}

type FormattedRun = {
    name: string,
    duration: string,
    location: string,
    start_time: string,
}

export default function SkipassRunsTable({ski_pass}: SkipassRunsTableProps) {
    const columns = [
        { key: "duration", label: "Duration", allowsSorting: true },
        { key: "start_time", label: "Date", allowsSorting: true },
    ];

    const locations = ["ALL", "ZRH", "WAW", "US", "DE"];

    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("ALL");
    const hasSearch = Boolean(searchValue);
    let list = useAsyncList<FormattedRun>({
        async load() {
            const runs = await getRacerRunsBySkipass(ski_pass);
            const formattedRuns = runs.map((run: Run) => {
                return {
                    ...run,
                    duration: moment.utc(run.duration * 100).format('HH:mm:ss'),
                    start_time: moment(run.start_time).format('HH:mm D/M/YY'),
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






    return (
        <div>
            <TableComponent
                columns={columns}
                list={{ items: list.items }}
                isLoading={isLoading}
                tableProps={{
                    sortDescriptor: list.sortDescriptor || { column: 'duration', direction: 'ascending' },
                    onSortChange: list.sort,
                }}
            />
        </div>
    );
}