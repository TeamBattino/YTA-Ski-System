"use server";

import prisma from "./prisma";


export interface Consistency {
    ski_pass: string;
    name: string;
    ldap: string;
    location: string;
    consistency: number;
}
export async function getConsistency(page: number = 0) {
  const consistency = await prisma.$queryRaw<Consistency[]>`
    WITH RankedRuns AS (
      SELECT
        r.*,
        racer.name,
        racer.ldap,
        racer.location,
        ROW_NUMBER() OVER (PARTITION BY r.ski_pass ORDER BY r.start_time DESC) as rn
      FROM
        run r
      JOIN
        racer ON r.ski_pass = racer.ski_pass
    ),
    Consistency AS (
      SELECT
        ski_pass,
        name,
        ldap,
        location,
        ABS(MAX(duration) - MIN(duration)) as consistency
      FROM
        RankedRuns
      WHERE rn <= 2
      GROUP BY
        ski_pass, name, ldap, location
    )
    SELECT *
    FROM Consistency
    ORDER BY consistency ASC
  `;
  return consistency;
}

export async function getConsistencyCount() {
    const count = await prisma.$queryRaw<number>`
        SELECT COUNT(DISTINCT ski_pass)
        FROM (
            SELECT ski_pass
            FROM run
            GROUP BY ski_pass
            HAVING COUNT(*) >= 2
        ) AS subquery
    `;
    return count;
}

type Run = {
    name: string;
    ski_pass: string;
    duration: number;
    ldap: string;
    location: string;
}
type TopRunProps = {
    page?: number;
}

// Sorted by duration Decending only showinng best run per skipass
export async function getTopRuns({ page = 0 }: TopRunProps) {
const runs = await prisma.$queryRaw<Run[]>`
    SELECT
        r.*,
        racer.name,
        racer.ldap,
        racer.location
    FROM
        run r
    JOIN
        racer ON r.ski_pass = racer.ski_pass
    WHERE
        r.start_time = (
            SELECT MAX(r2.start_time)
            FROM run r2
            WHERE r2.ski_pass = r.ski_pass
        )
    ORDER BY
        r.duration DESC
    LIMIT 10
    OFFSET ${page * 10}
`;

    return runs;
}   