/*
  Warnings:

  - You are about to drop the column `racer_id` on the `run` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "run" DROP CONSTRAINT "run_racer_id_fkey";

-- AlterTable
ALTER TABLE "run" DROP COLUMN "racer_id",
ADD COLUMN     "ski_pass" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "run" ADD CONSTRAINT "run_ski_pass_fkey" FOREIGN KEY ("ski_pass") REFERENCES "racer"("ski_pass") ON DELETE NO ACTION ON UPDATE NO ACTION;
