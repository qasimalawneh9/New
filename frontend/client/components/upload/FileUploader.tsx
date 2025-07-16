import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  File,
  Image,
  Video,
  Music,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Download,
  Trash2,
} from "lucide-react";
import {
  fileUploadService,
  FileUploadResponse,
  UploadOptions,
  FileCategory,
  UploadProgress,
} from "../../api/services/file-upload.service";

interface FileUploaderProps {
  category: FileCategory;
  onUploadComplete?: (files: FileUploadResponse[]) => void;
  onUploadProgress?: (progress: UploadProgress[]) => void;
  onError?: (error: string) => void;
  options?: Partial<UploadOptions>;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
}

interface FileWithProgress {
  file: File;
  progress: UploadProgress;
  result?: FileUploadResponse;
  error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  category,
  onUploadComplete,
  onUploadProgress,
  onError,
  options = {},
  multiple = false,
  maxFiles = 10,
  className = "",
  disabled = false,
  showPreview = true,
  showProgress = true,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState<FileWithProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultOptions: UploadOptions = {
    category,
    generateThumbnail: category === "image" || category === "video",
    makePublic: category === "avatar",
    ...options,
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    },
    [disabled],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      handleFiles(selectedFiles);

      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [],
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      // Check file count limit
      const totalFiles = fileList.length + files.length;
      if (totalFiles > maxFiles) {
        onError?.(
          `Maximum ${maxFiles} files allowed. You're trying to upload ${totalFiles} files.`,
        );
        return;
      }

      // Validate files
      const validFiles: File[] = [];
      const invalidFiles: { file: File; error: string }[] = [];

      for (const file of files) {
        const validation = fileUploadService.validateFile(file, defaultOptions);
        if (validation.isValid) {
          validFiles.push(file);
        } else {
          invalidFiles.push({ file, error: validation.errors.join(", ") });
        }
      }

      // Show validation errors
      if (invalidFiles.length > 0) {
        const errorMessage = `${invalidFiles.length} file(s) invalid:\n${invalidFiles.map((f) => `${f.file.name}: ${f.error}`).join("\n")}`;
        onError?.(errorMessage);
      }

      if (validFiles.length === 0) return;

      // Initialize file list with progress
      const filesWithProgress: FileWithProgress[] = validFiles.map((file) => ({
        file,
        progress: {
          fileId: Math.random().toString(36).substring(2),
          fileName: file.name,
          loaded: 0,
          total: file.size,
          percentage: 0,
          speed: 0,
          timeRemaining: 0,
          status: "pending",
        },
      }));

      setFileList((prev) => [...prev, ...filesWithProgress]);
      setIsUploading(true);

      try {
        // Upload files
        const uploadPromises = filesWithProgress.map(
          async (fileWithProgress) => {
            try {
              const result = await fileUploadService.uploadFile(
                fileWithProgress.file,
                defaultOptions,
                (progress) => {
                  setFileList((prev) =>
                    prev.map((f) =>
                      f.progress.fileId === progress.fileId
                        ? { ...f, progress }
                        : f,
                    ),
                  );

                  // Emit progress for all files
                  const allProgress = fileList.map((f) => f.progress);
                  onUploadProgress?.(allProgress);
                },
              );

              // Update with result
              setFileList((prev) =>
                prev.map((f) =>
                  f.progress.fileId === fileWithProgress.progress.fileId
                    ? {
                        ...f,
                        result,
                        progress: { ...f.progress, status: "completed" },
                      }
                    : f,
                ),
              );

              return result;
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : "Upload failed";

              setFileList((prev) =>
                prev.map((f) =>
                  f.progress.fileId === fileWithProgress.progress.fileId
                    ? {
                        ...f,
                        error: errorMessage,
                        progress: {
                          ...f.progress,
                          status: "error",
                          error: errorMessage,
                        },
                      }
                    : f,
                ),
              );

              throw error;
            }
          },
        );

        const results = await Promise.allSettled(uploadPromises);
        const successful = results
          .filter(
            (result): result is PromiseFulfilledResult<FileUploadResponse> =>
              result.status === "fulfilled",
          )
          .map((result) => result.value);

        if (successful.length > 0) {
          onUploadComplete?.(successful);
        }

        // Show errors for failed uploads
        const failed = results.filter((result) => result.status === "rejected");
        if (failed.length > 0) {
          onError?.(`${failed.length} file(s) failed to upload`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        onError?.(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setIsUploading(false);
      }
    },
    [
      fileList,
      maxFiles,
      defaultOptions,
      onError,
      onUploadComplete,
      onUploadProgress,
    ],
  );

  const removeFile = useCallback((fileId: string) => {
    setFileList((prev) => prev.filter((f) => f.progress.fileId !== fileId));
  }, []);

  const retryUpload = useCallback(
    async (fileId: string) => {
      const fileWithProgress = fileList.find(
        (f) => f.progress.fileId === fileId,
      );
      if (!fileWithProgress) return;

      // Reset progress
      setFileList((prev) =>
        prev.map((f) =>
          f.progress.fileId === fileId
            ? {
                ...f,
                error: undefined,
                progress: {
                  ...f.progress,
                  status: "pending",
                  percentage: 0,
                  loaded: 0,
                  error: undefined,
                },
              }
            : f,
        ),
      );

      try {
        const result = await fileUploadService.uploadFile(
          fileWithProgress.file,
          defaultOptions,
          (progress) => {
            setFileList((prev) =>
              prev.map((f) =>
                f.progress.fileId === progress.fileId ? { ...f, progress } : f,
              ),
            );
          },
        );

        setFileList((prev) =>
          prev.map((f) =>
            f.progress.fileId === fileId
              ? {
                  ...f,
                  result,
                  progress: { ...f.progress, status: "completed" },
                }
              : f,
          ),
        );

        onUploadComplete?.([result]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setFileList((prev) =>
          prev.map((f) =>
            f.progress.fileId === fileId
              ? {
                  ...f,
                  error: errorMessage,
                  progress: {
                    ...f.progress,
                    status: "error",
                    error: errorMessage,
                  },
                }
              : f,
          ),
        );
      }
    },
    [fileList, defaultOptions, onUploadComplete],
  );

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="w-8 h-8" />;
    if (file.type.startsWith("video/")) return <Video className="w-8 h-8" />;
    if (file.type.startsWith("audio/")) return <Music className="w-8 h-8" />;
    if (file.type.includes("pdf") || file.type.includes("document"))
      return <FileText className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const getStatusIcon = (status: UploadProgress["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "uploading":
      case "processing":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) =>
    fileUploadService.formatFileSize(bytes);
  const formatTimeRemaining = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : disabled
              ? "border-gray-200 bg-gray-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={defaultOptions.allowedTypes?.join(",")}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`p-4 rounded-full ${isDragOver ? "bg-blue-100" : "bg-gray-100"}`}
          >
            <Upload
              className={`w-8 h-8 ${isDragOver ? "text-blue-600" : "text-gray-400"}`}
            />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              {isDragOver ? "Drop files here" : "Upload files"}
            </p>
            <p className="text-sm text-gray-500">
              Drag & drop files here, or click to select files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {multiple ? `Up to ${maxFiles} files` : "Single file only"} •
              {defaultOptions.maxSize &&
                ` Max ${formatFileSize(defaultOptions.maxSize)}`}
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {fileList.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            {fileList.length} file{fileList.length !== 1 ? "s" : ""} selected
          </h4>

          <div className="space-y-2">
            {fileList.map((fileWithProgress) => (
              <div
                key={fileWithProgress.progress.fileId}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* File Icon */}
                <div className="flex-shrink-0 text-gray-400">
                  {getFileIcon(fileWithProgress.file)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileWithProgress.file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(fileWithProgress.progress.status)}
                      <button
                        onClick={() =>
                          removeFile(fileWithProgress.progress.fileId)
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{formatFileSize(fileWithProgress.file.size)}</span>
                    {fileWithProgress.progress.status === "uploading" && (
                      <span>
                        {fileWithProgress.progress.speed > 0 &&
                          `${formatFileSize(fileWithProgress.progress.speed)}/s • `}
                        {fileWithProgress.progress.timeRemaining > 0 &&
                          formatTimeRemaining(
                            fileWithProgress.progress.timeRemaining,
                          )}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {showProgress &&
                    fileWithProgress.progress.status !== "pending" && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{fileWithProgress.progress.percentage}%</span>
                          <span>
                            {formatFileSize(fileWithProgress.progress.loaded)} /{" "}
                            {formatFileSize(fileWithProgress.progress.total)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              fileWithProgress.progress.status === "error"
                                ? "bg-red-500"
                                : fileWithProgress.progress.status ===
                                    "completed"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                            }`}
                            style={{
                              width: `${fileWithProgress.progress.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                  {/* Error Message */}
                  {fileWithProgress.error && (
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-red-600">
                        {fileWithProgress.error}
                      </p>
                      <button
                        onClick={() =>
                          retryUpload(fileWithProgress.progress.fileId)
                        }
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Success Actions */}
                  {fileWithProgress.result && showPreview && (
                    <div className="mt-2 flex items-center space-x-2">
                      {fileWithProgress.result.thumbnailUrl && (
                        <img
                          src={fileWithProgress.result.thumbnailUrl}
                          alt="Preview"
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <div className="flex space-x-1">
                        <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-700">
              Uploading{" "}
              {
                fileList.filter(
                  (f) =>
                    f.progress.status === "uploading" ||
                    f.progress.status === "processing",
                ).length
              }{" "}
              file(s)...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
