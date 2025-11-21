SET search_path TO public;
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
        duration ASC;