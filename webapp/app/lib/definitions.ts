import { UUID } from "crypto"

export type Racer = {
    racer_id: UUID;
    name: string;
    ldap: string;
    ski_passes: string[];
};

export type Run = {
    run_id: UUID;
    racer_id: UUID;
    start_time: Date;
    duration: number;
};