"use client";
import { useAsyncList } from "react-stately";
import TableComponent from "./Table";
import { Consistency, getConsistency } from "@/lib/db-helper";
import { useState } from "react";

export default function ConsistencyTable() {
    const columns = [
        { key: "name", label: "Name" },
        { key: "ldap", label: "LDAP" },
        { key: "consistency", label: "Consistency" },
        { key: "location", label: "Location" },
    ];

    const [isLoading, setIsLoading] = useState(true);
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
        }
    });

    return (
        <TableComponent
            columns={columns}
            list={{ items: list.items }}
            isLoading={isLoading}
        />
    );
}