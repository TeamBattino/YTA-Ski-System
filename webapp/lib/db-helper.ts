"use server";

import prisma from "./prisma";

export interface Consistency {
  ski_pass: string;
  name: string;
  ldap: string;
  location: string;
  consistency: number;
  race_id: string;
}

export async function getAllConsistency() {
  const consistency = await prisma.$queryRaw<Consistency[]>`
        WITH RunCounts AS (
          SELECT
              ski_pass,
              race_id,
              COUNT(*) as run_count
          FROM
              run
          GROUP BY
              ski_pass, race_id
          HAVING COUNT(*) >= 2
        ),
        RankedRuns AS (
            SELECT
                r.*,
                racer.name,
                racer.ldap,
                racer.location,
                ROW_NUMBER() OVER (PARTITION BY r.ski_pass ORDER BY r.start_time DESC) as rn
            FROM
              run r
              JOIN racer ON r.ski_pass = racer.ski_pass AND r.race_id = racer.race_id
            JOIN RunCounts rc ON r.ski_pass = rc.ski_pass AND r.race_id = rc.race_id
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
                ski_pass, race_id, name, ldap, location
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
            SELECT ski_pass, race_id
            FROM run
            GROUP BY ski_pass, race_id
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
  race_id: string;
};
export type RunWithDupilcates = {
  run_id: string;
  name: string;
  ski_pass: string;
  duration: number;
  ldap: string;
  location: string;
  start_time: Date;
  race_id: string;
};

export async function getTopRuns() {
  const racersWithShortestRun = await prisma.$queryRaw<Run[]>`
    SELECT
        r.ski_pass,
        r.race_id,
        racer.name,
        racer.ldap,
        racer.location,
        racer.race_id,
        MIN(r.duration) as duration
    FROM
        run r
    JOIN
        racer ON r.ski_pass = racer.ski_pass AND r.race_id = racer.race_id
    GROUP BY
        r.ski_pass, r.race_id, racer.name, racer.ldap, racer.location, racer.race_id
    ORDER BY
        duration ASC
  `;
  return racersWithShortestRun;
}
export async function getRecentRuns() {
  const recentRuns = await prisma.$queryRaw<RunWithDupilcates[]>`
        SELECT
            r.*,
            racer.name,
            racer.ldap,
            racer.location
        FROM
            run r
        JOIN
            racer ON r.ski_pass = racer.ski_pass  AND r.race_id = racer.race_id
        GROUP BY racer.race_id, r.start_time, r.duration, r.ski_pass, r.run_id, racer.name, racer.ldap, racer.location
        ORDER BY
            r.start_time DESC
`;
  return recentRuns;
}

export async function getRaces() {
  const races = await prisma.$queryRaw<RunWithDupilcates[]>`
        SELECT
            r.*
        FROM
            race r
        ORDER BY
            r.name
    `;
  return races;
}

export type Racer = {
  ski_pass: string;
  name: string;
  ldap: string;
  location: string;
  consistency?: number;
};

// Get the singular racer that has this ski pass and calculate his consistency if they have more than 2 runs based on his durration
