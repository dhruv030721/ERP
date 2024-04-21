/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Faculty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subjects` on the `Faculty` table. All the data in the column will be lost.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("employee_id");

-- AlterTable
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_pkey",
DROP COLUMN "subjects",
ADD CONSTRAINT "Faculty_pkey" PRIMARY KEY ("employee_id");

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("enrollment_no");

-- CreateTable
CREATE TABLE "SubjectList" (
    "id" SERIAL NOT NULL,
    "semester" INTEGER NOT NULL,
    "subject" TEXT[],
    "facultyId" BIGINT,

    CONSTRAINT "SubjectList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubjectList" ADD CONSTRAINT "SubjectList_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("employee_id") ON DELETE SET NULL ON UPDATE CASCADE;
