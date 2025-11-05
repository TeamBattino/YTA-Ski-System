/*
  Warnings:

  - You are about to drop the `site` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[race_id,ski_pass]` on the table `racer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `race_id` to the `racer` table without a default value. This is not possible if the table is not empty.
  - Made the column `ski_pass` on table `racer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `race_id` to the `run` table without a default value. This is not possible if the table is not empty.
  - Made the column `ski_pass` on table `run` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "racer" DROP CONSTRAINT "racer_location_fkey";

-- DropForeignKey
ALTER TABLE "run" DROP CONSTRAINT "run_ski_pass_fkey";

-- DropIndex
DROP INDEX "racer_ldap_key";

-- DropIndex
DROP INDEX "racer_ski_pass_key";

-- AlterTable
ALTER TABLE "racer" ADD COLUMN     "race_id" UUID NOT NULL,
ALTER COLUMN "ski_pass" SET NOT NULL;

-- AlterTable
ALTER TABLE "run" ADD COLUMN     "race_id" UUID NOT NULL,
ALTER COLUMN "ski_pass" SET NOT NULL;

-- DropTable
DROP TABLE "site";

-- CreateTable
CREATE TABLE "race" (
    "race_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255),

    CONSTRAINT "race_pkey" PRIMARY KEY ("race_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "race_name_key" ON "race"("name");

-- CreateIndex
CREATE UNIQUE INDEX "racer_race_id_ski_pass_key" ON "racer"("race_id", "ski_pass");

-- AddForeignKey
ALTER TABLE "racer" ADD CONSTRAINT "racer_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("race_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run" ADD CONSTRAINT "run_race_id_ski_pass_fkey" FOREIGN KEY ("race_id", "ski_pass") REFERENCES "racer"("race_id", "ski_pass") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run" ADD CONSTRAINT "run_race_id_fkey" FOREIGN KEY ("race_id") REFERENCES "race"("race_id") ON DELETE CASCADE ON UPDATE CASCADE;
