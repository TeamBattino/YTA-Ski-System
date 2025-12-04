"use server";

import prisma from "./prisma";

/** Types */
export interface Consistency {
  ski_pass: string;
  name: string;
  ldap: string;
  location: string;
  consistency: number;
  race_id: string;
}

export type CurrentRace = {
  race_id: string;
};

export type FormattedRun = {
  name: string;
  ski_pass: string;
  duration: number;
  ldap: string;
  location: string;
  start_time: Date;
  race_id: string;
  run_id: string;
};

export type Run = {
  ski_pass: string;
  duration: number;
  start_time: Date;
  race_id: string;
  run_id: string;
};

export type Admin = {
  admin_id: string;
  email: string;
};

export type Racer = {
  racer_id: string;
  ski_pass: string;
  name: string;
  ldap: string;
  location: string;
  consistency?: number;
};

export type Race = {
  race_id: string;
  name: string;
};
/** Consistency */
export async function getAllConsistency(race_id: string) {
  const consistency = await prisma.$queryRaw<Consistency[]>`
        WITH RunCounts AS (
          SELECT
              ski_pass,
              race_id,
              COUNT(*) as run_count
          FROM
              run
          WHERE race_id = ${race_id}
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
                race_id,
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

/** Top Runs */

export async function getTopRuns(race_id: string) {
  const racersWithShortestRun = await prisma.$queryRaw<FormattedRun[]>`
    SELECT 
      r.ski_pass,
      r.race_id,
      r.run_id,
      r.start_time,
      racer.name,
      racer.ldap,
      racer.location,
      r.duration
    FROM run r
    JOIN racer ON r.ski_pass = racer.ski_pass AND r.race_id = racer.race_id
    WHERE r.race_id = ${race_id}
    AND r.run_id IN (
      SELECT run_id FROM run
      WHERE race_id = ${race_id}
      ORDER BY ski_pass, duration ASC
      LIMIT 1
    )
    GROUP BY r.ski_pass, r.race_id, r.run_id, r.start_time, racer.name, racer.ldap, racer.location, r.duration
    ORDER BY r.duration ASC
  `;
  return racersWithShortestRun;
}

/** Recent Runs */
export async function getRecentRuns(race_id: string) {
  const recentRuns = await prisma.$queryRaw<FormattedRun[]>`
        SELECT
            r.*,
            racer.name,
            racer.ldap,
            racer.location
        FROM
            run r
        JOIN
            racer ON r.ski_pass = racer.ski_pass  AND r.race_id = racer.race_id
        WHERE r.race_id = ${race_id} AND racer.race_id = ${race_id} 
        GROUP BY racer.race_id, r.start_time, r.duration, r.ski_pass, r.run_id, racer.name, racer.ldap, racer.location, r.race_id
        ORDER BY
            r.start_time DESC
`;
  return recentRuns;
}
/*** CRUD for Entities */

/** Create */

export async function createRace(name: string) {
  const newRace = await prisma.race.create({
    data: {
      name: name,
    },
  });
  return newRace;
}

export async function createRacer(
  name: string,
  ldap: string,
  ski_pass: string,
  location: string,
  race_id: string
) {
  const newRacer = await prisma.racer.upsert({
    where: {
      racer_identifier: {
        ski_pass,
        race_id,
      },
    },
    update: {
      name,
      ldap,
      location,
    },
    create: {
      name,
      ldap,
      ski_pass,
      location,
      race_id,
    },
  });
  return newRacer as Racer;
}

export async function createRun(run: Run) {
  // Check if the ski_pass exists in the racer table
  const racerExists = await prisma.racer.findUnique({
    where: {
      racer_identifier: {
        ski_pass: run.ski_pass,
        race_id: run.race_id,
      },
    },
  });

  if (!racerExists) {
    throw new Error(
      `Racer with ski_pass ${run.ski_pass} and race_id ${run.race_id} does not exist.`
    );
  }

  // If racer exists, create the run
  const newRun = await prisma.run.create({
    data: {
      start_time: run.start_time,
      duration: run.duration,
      ski_pass: run.ski_pass,
      race_id: run.race_id,
    },
  });
  return newRun;
}

/** Read */
export async function getRaces() {
  const races = await prisma.$queryRaw<Race[]>`
        SELECT
            r.*
        FROM
            race r
        ORDER BY
            r.name
    `;
  return races;
}

export async function getRacers() {
  const racers = await prisma.$queryRaw<Racer[]>`
        SELECT
            r.*
        FROM
            racer r
    `;
  return racers;
}

export async function getRacer(ski_pass: string) {
  const current_race = await getCurrentRace();
  const racers = await prisma.$queryRaw<Racer[]>`
    WITH RacerRuns AS (
      SELECT
        r.duration
      FROM
        run r
      WHERE r.race_id = ${current_race.race_id} AND r.ski_pass = ${ski_pass}
      GROUP BY r.race_id, r.ski_pass, r.duration, r.start_time
      ORDER BY
        r.start_time DESC
      LIMIT 2
    ),
    Consistency AS (
      SELECT
        ABS(MAX(duration) - MIN(duration)) as consistency
      FROM
        RacerRuns
      HAVING COUNT(*) = 2
    )
    SELECT
      r.*,
      c.consistency
    FROM
      racer r
    LEFT JOIN
      Consistency c ON 1=1
    WHERE
      r.ski_pass = ${ski_pass} AND r.race_id = ${current_race.race_id}  
    `;
  if (racers.length === 0) {
    throw new Error("Racer not found");
  }
  return racers[0];
}

export async function getCurrentRace() {
  const currentRace = await prisma.$queryRaw<Race[]>`
    SELECT
      r.*
    FROM
      settings s
    JOIN
      race r ON s.value::uuid = r.race_id
    WHERE s.key = 'current_race'
  `;
  return currentRace[0];
}

export async function getShowConsistency() {
  const showConsistency = await prisma.$queryRaw<Array<{ value: string }>>`
        SELECT
            value
        FROM
            settings s
        WHERE s.key = 'show_consistency'
    `;
  console.log("Consistency", showConsistency);
  return showConsistency[0]?.value == "true";
}

export async function getAdminByEmail(email: string) {
  const admins = await prisma.$queryRaw<Admin[]>`
        SELECT
            *
        FROM
            admin
        WHERE
          email = ${email}
    `;
  return admins;
}

export async function getRacerRunsBySkipass(ski_pass: string) {
  const current_race = await getCurrentRace();
  const runsOfRacer = await prisma.$queryRaw<Run[]>`SELECT
            r.*,
            racer.name,
            racer.ldap,
            racer.location
        FROM
            run r
        JOIN
            racer ON r.ski_pass = racer.ski_pass  AND r.race_id = racer.race_id
        WHERE r.race_id = ${current_race.race_id} AND racer.race_id = ${current_race.race_id} AND r.ski_pass = ${ski_pass}
        GROUP BY racer.race_id, r.start_time, r.duration, r.ski_pass, r.run_id, r.race_id, racer.name, racer.ldap, racer.location
        ORDER BY
            r.start_time DESC`;
  return runsOfRacer;
}

export async function fetchRacerBySkiPass(ski_pass: string) {
  const race = await getCurrentRace();
  let racer = (await prisma.racer.findUnique({
    where: {
      racer_identifier: {
        ski_pass: ski_pass,
        race_id: race.race_id,
      },
    },
  })) as Racer | null;
  console.log("Racer without ID", racer);
  if (racer == null) {
    const userNumber =
      await prisma.$queryRaw<Array<{ count: string }>>`SELECT COUNT(*) FROM racer WHERE race_id = ${race.race_id}`;
    const name = "Unregistered User #" + userNumber[0].count;
    const ldap = "unregistered" + userNumber[0].count;
    console.log("User number", userNumber[0].count);
    racer = await prisma.$queryRaw<Racer>`
      INSERT INTO racer(name, ldap, race_id, ski_pass, location)
      VALUES (
      ${name},
      ${ldap},
      ${race.race_id},
      ${ski_pass},
      'ZRH'
      )
      RETURNING *;
    `;
  }
  console.log("new created racer", racer);
  return racer;
}

export async function fetchRacers() {
  const racers = await prisma.racer.findMany();
  return racers;
}

/** Update */
export async function updateRun(run: Run) {
  const updatedRun = await prisma.run.update({
    where: {
      run_id: run.run_id,
    },
    data: {
      start_time: run.start_time,
      duration: run.duration,
      ski_pass: run.ski_pass,
      race_id: run.race_id,
    },
  });
  return updatedRun;
}

export async function updateCurrentRace(race: Race) {
  const updatedRace = await prisma.$queryRaw<CurrentRace>`
    UPDATE settings
    SET value = ${race.race_id}
    WHERE key = 'current_race';
  `;

  return updatedRace;
}

export async function updateShowConsistency(showConsistency: boolean) {
  const updatedShowConsistency = await prisma.$queryRaw<string>`
    UPDATE settings
    SET value = ${showConsistency as unknown as string}
    WHERE key = 'show_consistency';
  `;
  return updatedShowConsistency;
}

/** Delete */
export async function deleteRun(run_id: string) {
  await prisma.run
    .delete({
      where: {
        run_id: run_id,
      },
    })
    .then((res) => console.log(res));
}
