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

export default function SkipassRunsTable({ ski_pass }: SkipassRunsTableProps) {
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
                const durationMilliseconds = run.duration / 10;
                const duration = moment.duration(durationMilliseconds);
                const formattedDuration = moment.utc(duration.asMilliseconds()).format('mm:ss.SSSS')
                return {
                    ...run,
                    duration: formattedDuration,
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
                    if (sortDescriptor.column === "start_time") {
                        let first = moment(a[sortDescriptor.column as keyof FormattedRun], 'HH:mm D/M/YY');
                        let second = moment(b[sortDescriptor.column as keyof FormattedRun], 'HH:mm D/M/YY');
                        let cmp = first.isBefore(second) ? -1 : 1;

                        if (sortDescriptor.direction === "descending") {
                            cmp *= -1;
                        }

                        return cmp;
                    } else {
                        const parseDuration = (durationString: string): number => {
                            const [minutes, secondsAndMilliseconds] = durationString.split(":");
                            const [seconds, millisecondsPart] = secondsAndMilliseconds.split(".");
                            const minutesInSeconds = parseInt(minutes, 10) * 60;
                            const secondsValue = parseInt(seconds, 10);
                            let millisecondsValue = 0;

                            if (millisecondsPart) {
                                // Treat the milliseconds part as a fraction of a second
                                const multiplier = Math.pow(10, 3 - millisecondsPart.length);
                                millisecondsValue = parseInt(millisecondsPart, 10) * multiplier;
                            }

                            return (minutesInSeconds + secondsValue) * 1000 + millisecondsValue;
                        };

                        const durationA = parseDuration(a.duration);
                        const durationB = parseDuration(b.duration);
                        let cmp = durationA < durationB ? -1 : 1;

                        if (sortDescriptor.direction === "descending") {
                            cmp *= -1;
                        }
                        return cmp;
                    }
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
                    sortDescriptor: list.sortDescriptor || { column: 'start_time', direction: 'ascending' },
                    onSortChange: list.sort,
                }}
            />
        </div>
    );
}