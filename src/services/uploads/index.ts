import { apiClient, unwrapResponseData } from "../core/client"
import type { ApiSuccessResponse } from "../core/types"
import type { UploadedFile } from "@/types/domain/upload"

function buildSingleFileFormData(file: File): FormData {
  const formData = new FormData()
  formData.append("file", file)
  return formData
}

function buildMultipleFilesFormData(files: File[]): FormData {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append("files", file)
  })
  return formData
}

export async function uploadSingleFile(file: File): Promise<UploadedFile> {
  const formData = buildSingleFileFormData(file)
  const response = await apiClient.post<ApiSuccessResponse<UploadedFile>>(
    "/upload/single",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return unwrapResponseData(response)
}

export async function uploadMultipleFiles(
  files: File[]
): Promise<UploadedFile[]> {
  const formData = buildMultipleFilesFormData(files)
  const response = await apiClient.post<ApiSuccessResponse<UploadedFile[]>>(
    "/upload/multiple",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return unwrapResponseData(response)
}
