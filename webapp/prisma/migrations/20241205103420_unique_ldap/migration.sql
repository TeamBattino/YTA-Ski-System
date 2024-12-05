/*
  Warnings:

  - A unique constraint covering the columns `[ldap]` on the table `racer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "racer_ldap_key" ON "racer"("ldap");
