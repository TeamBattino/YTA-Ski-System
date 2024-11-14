-- CreateTable
CREATE TABLE "racer" (
    "name" VARCHAR(255),
    "ldap" VARCHAR(255),
    "racer_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ski_passes" TEXT[],

    CONSTRAINT "racer_pkey" PRIMARY KEY ("racer_id")
);

-- CreateTable
CREATE TABLE "run" (
    "start_time" TIMESTAMP(6),
    "duration" INTEGER,
    "racer_id" UUID,
    "run_id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "run_pkey" PRIMARY KEY ("run_id")
);

-- AddForeignKey
ALTER TABLE "run" ADD CONSTRAINT "run_racer_id_fkey" FOREIGN KEY ("racer_id") REFERENCES "racer"("racer_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

