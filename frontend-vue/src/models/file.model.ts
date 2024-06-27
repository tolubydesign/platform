
export type TFile = {
  serverFileName: string,
  uploadedFileName: string,
  mimetype: string,
  encoding: string,
  project_id: string | undefined | null,
  uploadedAt: string,
  creator: string
}

export type TProject = {
  "id": number,
  "project_name": string,
  "creator_email": string,
  "createdAt": string,
  "participants": string[],
  "files": TFile[] | null
}