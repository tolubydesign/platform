-- CreateTable
CREATE TABLE "File" (
    "serverFileName" TEXT NOT NULL,
    "uploadedFileName" TEXT NOT NULL,
    "dir" VARCHAR NOT NULL,
    "mimetype" VARCHAR(90) NOT NULL,
    "encoding" VARCHAR(10) NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" INTEGER,
    "creator" VARCHAR,

    CONSTRAINT "File_pkey" PRIMARY KEY ("serverFileName")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "project_name" VARCHAR NOT NULL,
    "creator_email" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participants" VARCHAR[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_serverFileName_key" ON "File"("serverFileName");

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_creator_fkey" FOREIGN KEY ("creator") REFERENCES "Account"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_creator_email_fkey" FOREIGN KEY ("creator_email") REFERENCES "Account"("email") ON DELETE SET NULL ON UPDATE CASCADE;
