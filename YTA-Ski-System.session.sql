INSERT INTO admin(email) VALUES ('michel.mahadeva@gmail.com');
INSERT INTO race(race_id, name) VALUES ('6d3173f4-823b-4e05-a4d7-b2decacc7ade', '2026');
INSERT INTO settings(key, value) VALUES ('current_race', '6d3173f4-823b-4e05-a4d7-b2decacc7ade');
INSERT INTO settings(key, value) VALUES ('show_consistency', 'false');
SELECT *
FROM settings;
SELECT *
FROM run;
SELECT *
FROM race;
SELECT *
FROM racer;
SELECT *
FROM admin;
SELECT r.*
FROM settings s
    JOIN race r ON s.value::uuid = r.race_id
    WHERE s.key = 'current_race';
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
SELECT
            value
        FROM
            settings s
        WHERE s.key = 'show_consistency';
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
    WHERE r.race_id = '6d3173f4-823b-4e05-a4d7-b2decacc7ade'
    AND r.run_id IN (
    SELECT DISTINCT ON (ski_pass) run_id FROM run
    WHERE race_id = '6d3173f4-823b-4e05-a4d7-b2decacc7ade'
    ORDER BY ski_pass, duration ASC
    )
    GROUP BY r.ski_pass, r.race_id, r.run_id, r.start_time, racer.name, racer.ldap, racer.location, r.duration
    ORDER BY r.duration ASC;
