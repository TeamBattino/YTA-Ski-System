SELECT *
FROM current_race;
SELECT *
FROM run;
SELECT *
FROM race;
SELECT *
FROM racer;
SELECT *
FROM admin;
SELECT r.*
FROM current_race cr
    JOIN race r ON cr.race_id = r.race_id;
SELECT r.ski_pass,
    r.race_id,
    r.run_id,
    r.start_time,
    racer.name,
    racer.ldap,
    racer.location,
    r.duration
FROM run r
    JOIN racer ON r.ski_pass = racer.ski_pass
    AND r.race_id = racer.race_id
WHERE r.race_id = '6d3173f4-823b-4e05-a4d7-b2decacc7ade'
    AND r.run_id IN (
        SELECT run_id
        FROM run
        WHERE race_id = '6d3173f4-823b-4e05-a4d7-b2decacc7ade'
        ORDER BY ski_pass,
            duration ASC
        LIMIT 1
    )
GROUP BY r.ski_pass,
    r.race_id,
    r.run_id,
    r.start_time,
    racer.name,
    racer.ldap,
    racer.location,
    r.duration
ORDER BY r.duration ASC;