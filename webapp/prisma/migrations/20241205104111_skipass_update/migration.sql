/*
  Warnings:

  - You are about to alter the column `ski_passes` on the `racer` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - A unique constraint covering the columns `[ski_passes]` on the table `racer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "racer" ALTER COLUMN "ski_passes" SET NOT NULL,
ALTER COLUMN "ski_passes" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "racer_ski_passes_key" ON "racer"("ski_passes");
