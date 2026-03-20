import { Dialog, DialogContent } from "@mui/material";
import { PatientFile } from "../../interfaces/patient-file.interface";
import { getFileUrl } from "../../utilities/file-url";

interface Props {
  file: PatientFile | null;
  open: boolean;
  onClose: () => void;
}

export default function FilePreview({ file, open, onClose }: Props) {
  if (!file) return null;

  const url = getFileUrl(file.storagePath);

  // 🔥 DETECCIÓN ROBUSTA (igual que FileList)
  const isImage =
    file.mimeType?.startsWith("image") ||
    file.originalName?.match(/\.(jpg|jpeg|png|webp|gif)$/i);

  const isPdf =
    file.mimeType === "application/pdf" ||
    file.originalName?.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent>

        {isImage && (
          <img
            src={url}
            style={{
              width: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        )}

        {isPdf && (
          <iframe
            src={url}
            width="100%"
            height="700px"
          />
        )}

        {!isImage && !isPdf && (
          <a href={url} target="_blank" rel="noreferrer">
            Descargar archivo
          </a>
        )}

      </DialogContent>
    </Dialog>
  );
}