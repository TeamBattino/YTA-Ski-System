"use client";
import { useAsyncList } from "react-stately";
import TableComponent from "./Table";
import { getRacerRunsBySkipass, FormattedRun } from "@/lib/db-helper";
import { useState } from "react";
import { run as Run } from "@/src/generated/client";

import moment from "moment";

type SkipassRunsTableProps = {
  ski_pass: string;
};

type StringFormattedRun = {
  run_id: string;
  name: string;
  duration: string;
  location: string;
  start_time: string;
};

export default function SkipassRunsTable({ ski_pass }: SkipassRunsTableProps) {
  const columns = [
    { key: "duration", label: "Duration", allowsSorting: true },
    { key: "start_time", label: "Date", allowsSorting: true },
  ];

  const [isLoading, setIsLoading] = useState(true);

  const list = useAsyncList<StringFormattedRun>({
    async load() {
      const runs = await getRacerRunsBySkipass(ski_pass);
      const formattedRuns = runs.map((run: Run) => {
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
          } else {
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
          }
        }),
      };
    },
  });

  return (
    <div>
      <TableComponent
        columns={columns}
        list={{ items: list.items as Iterable<FormattedRun> }}
        isLoading={isLoading}
        tableProps={{
          sortDescriptor: list.sortDescriptor || {
            column: "start_time",
            direction: "ascending",
          },
          onSortChange: list.sort,
        }}
      />
    </div>
  );
}
