/*
  Warnings:

  - A unique constraint covering the columns `[project_name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_project_name_key" ON "Project"("project_name");
