import SkipassRunsTable from "@/components/SkipassRunsTable"
import { Spinner } from "@nextui-org/react";
import { useState } from "react";
import PageBuilder from "./PageBuilder";


async function Page(
    {
        params,
    }: {
        params: Promise<{ ski_pass: string }>
    }) {
    const ski_pass = (await params).ski_pass
    return <PageBuilder ski_pass={ski_pass} />
}

export default Page