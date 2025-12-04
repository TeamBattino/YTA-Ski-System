"use client";
import SkipassRunsTable from "@/components/Tables/SkipassRunsTable";
import { getRacer, Racer } from "@/lib/db-helper";
import { Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react"

type PageBuilderProps = {
    ski_pass: string;
}

function PageBuilder({ ski_pass }: PageBuilderProps) {
    const [racer, setRacer] = useState<Racer | null>(null);
    useEffect(() => {
        getRacer(ski_pass).then((racer) => {
            setRacer(racer);
        });
    }
        , [ski_pass]);
    return (
        <div>
            {(racer) ? (
                <>
                    <h1 className="py-2 text-2xl font-bold">{racer.name}&apos;s Personal Leaderboard</h1>
                    {racer.consistency && <h2 className="py-2 text-xl">⭐ Current Consistency is: {racer.consistency/10000}s</h2>}
                    <h2 className="py-2 text-xl font-bold">Recent Runs</h2>
                    <SkipassRunsTable ski_pass={ski_pass} />    
                </>
            ) :
                (
                    <div className="flex justify-center items-center h-full">
                        <Spinner label="Loading Person..." />
                    </div>
                )}
        </div>
    )
}

export default PageBuilder