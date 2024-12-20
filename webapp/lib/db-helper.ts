"use server";

import prisma from "./prisma";


export interface Consistency {
  ski_pass: string;
  name: string;
  ldap: string;
  location: string;
  consistency: number;
}

export async function getAllConsistency() {
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

export type Run = {
  name: string;
  ski_pass: string;
  duration: number;
  ldap: string;
  location: string;
  start_time: Date;
}

// Sorted by duration Decending only showinng best run per skipass
export async function getTopRuns() {
  const topRuns = await prisma.$queryRaw<Run[]>`
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
`;
  return topRuns;
}

export async function getRacerRunsBySkicard(ski_pass: string) {
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
            r.ski_pass = ${ski_pass}
        ORDER BY
            r.start_time DESC
    `;
  return runs;
}

export type Racer = {
  ski_pass: string;
  name: string;
  ldap: string;
  location: string;
}
export async function getRacer(ski_pass: string): Promise<Racer> {
  const racer = await prisma.$queryRaw<Racer[]>`
        SELECT
            *
        FROM
            racer
        WHERE
            ski_pass = ${ski_pass}
            ;
    `;
  if (racer.length === 0) {
    throw new Error("Racer not found");
  }
  return racer[0];
}
