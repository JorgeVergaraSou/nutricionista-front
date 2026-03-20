// src/interfaces/patient-file.interface.ts
export interface PatientFile {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  storagePath: string;
  size: number;
  uploadedAt: string;
}