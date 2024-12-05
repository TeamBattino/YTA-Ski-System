/*
  Warnings:

  - You are about to drop the column `ski_passes` on the `racer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ski_pass]` on the table `racer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "racer_ski_passes_key";

-- AlterTable
ALTER TABLE "racer" DROP COLUMN "ski_passes",
ADD COLUMN     "ski_pass" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "racer_ski_pass_key" ON "racer"("ski_pass");
