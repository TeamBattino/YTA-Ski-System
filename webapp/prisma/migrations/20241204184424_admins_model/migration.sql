-- CreateTable
CREATE TABLE "admin" (
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),

    CONSTRAINT "admin_pkey" PRIMARY KEY ("username")
);
