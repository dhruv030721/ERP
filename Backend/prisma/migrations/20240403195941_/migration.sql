/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Faculty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "employee_id" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "contactnumber" BIGINT NOT NULL,
    "password" TEXT NOT NULL,
    "subjects" TEXT[],

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "enrollment_no" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "contactnumber" BIGINT NOT NULL,
    "password" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "batch" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_employee_id_key" ON "Faculty"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_email_key" ON "Faculty"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_enrollment_no_key" ON "Student"("enrollment_no");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_employee_id_key" ON "Admin"("employee_id");
