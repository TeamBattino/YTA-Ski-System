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