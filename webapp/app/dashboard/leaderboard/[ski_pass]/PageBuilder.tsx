"use client";
import SkipassRunsTable from "@/components/SkipassRunsTable";
import { getRacer, Racer } from "@/lib/db-helper";
import { Spinner } from "@nextui-org/react";
import { redirect } from "next/navigation";
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
                    <h1 className="py-2 text-2xl font-bold">{racer.name}'s Personal Leaderboard</h1>
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