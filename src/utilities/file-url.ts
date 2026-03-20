// src/utilities/file-url.ts
export const getFileUrl = (storagePath: string) => {
  if (!storagePath) return "";

  let cleanPath = storagePath;

  // 🔥 eliminar "./" inicial
  cleanPath = cleanPath.replace(/^\.?\//, "");

  // 🔥 eliminar "uploads/" si ya viene incluido
  cleanPath = cleanPath.replace(/^uploads\//, "");

  return `http://localhost:3006/nutri/uploads/${cleanPath}`;
};