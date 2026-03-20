// src/components/files/FileList.tsx
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Card,
  CardMedia,
  CardContent
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionIcon from "@mui/icons-material/Description";

import { useState } from "react";

import { PatientFile } from "../../interfaces/patient-file.interface";

import FilePreview from "./FilePreview";
import { getFileUrl } from "../../utilities/file-url";

interface Props {
  files: PatientFile[];
}

export default function FileList({ files }: Props) {

  const [selectedFile, setSelectedFile] =
    useState<PatientFile | null>(null);

  const [openPreview, setOpenPreview] = useState(false);

  const openFile = (file: PatientFile) => {
    setSelectedFile(file);
    setOpenPreview(true);
  };

  return (
    <>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={2}
        mt={1}
      >
        {files.map((file) => {

          const url = getFileUrl(file.storagePath);
          const isImage =
            file.mimeType?.startsWith("image") ||
            file.originalName?.match(/\.(jpg|jpeg|png|webp|gif)$/i);

          return (
            <Card
              key={file.id}
              sx={{
                width: 160,
                borderRadius: 2,
                boxShadow: 2
              }}
            >
              {isImage ? (
                <CardMedia
                  component="img"
                  height="120"
                  image={url}
                  sx={{
                    objectFit: "cover",
                    cursor: "pointer"
                  }}
                  onClick={() => openFile(file)}
                />
              ) : (
                <Box
                  sx={{
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f5f5f5"
                  }}
                >
                  <DescriptionIcon
                    sx={{ fontSize: 50 }}
                  />
                </Box>
              )}

              <CardContent
                sx={{
                  p: 1,
                  "&:last-child": { pb: 1 }
                }}
              >
                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {file.originalName}
                </Typography>

                <Box
                  display="flex"
                  justifyContent="space-between"
                >
                  <IconButton
                    size="small"
                    onClick={() => openFile(file)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    component="a"
                    href={url}
                    download
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <FilePreview
        file={selectedFile}
        open={openPreview}
        onClose={() => setOpenPreview(false)}
      />
    </>
  );
}