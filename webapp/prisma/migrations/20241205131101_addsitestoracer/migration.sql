-- DropForeignKey
ALTER TABLE "run" DROP CONSTRAINT "run_ski_pass_fkey";

-- AlterTable
ALTER TABLE "racer" ADD COLUMN     "location" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "racer" ADD CONSTRAINT "racer_location_fkey" FOREIGN KEY ("location") REFERENCES "site"("location") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run" ADD CONSTRAINT "run_ski_pass_fkey" FOREIGN KEY ("ski_pass") REFERENCES "racer"("ski_pass") ON DELETE CASCADE ON UPDATE CASCADE;
