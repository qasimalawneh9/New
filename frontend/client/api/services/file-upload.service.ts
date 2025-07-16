import { BaseApiService } from "../base.service";

export interface FileUploadResponse {
  id: string;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: number;
  category: FileCategory;
  metadata?: FileMetadata;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  expiresAt?: string;
}

export type FileCategory =
  | "avatar"
  | "document"
  | "video"
  | "audio"
  | "image"
  | "lesson_material"
  | "assignment"
  | "certificate"
  | "profile_document";

export interface UploadOptions {
  category: FileCategory;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  generateThumbnail?: boolean;
  makePublic?: boolean;
  description?: string;
  tags?: string[];
  expiresIn?: number; // days
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  timeRemaining: number; // seconds
  status: "pending" | "uploading" | "processing" | "completed" | "error";
  error?: string;
}

export interface BulkUploadResult {
  successful: FileUploadResponse[];
  failed: Array<{ file: File; error: string }>;
  totalFiles: number;
  totalSize: number;
  uploadTime: number;
}

export interface FileSearchFilters {
  category?: FileCategory;
  uploadedBy?: number;
  dateRange?: { start: string; end: string };
  fileType?: string;
  tags?: string[];
  isPublic?: boolean;
  minSize?: number;
  maxSize?: number;
}

export interface FilePermissions {
  canView: boolean;
  canDownload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
}

class FileUploadService extends BaseApiService {
  private uploadProgress = new Map<string, UploadProgress>();
  private readonly MAX_CONCURRENT_UPLOADS = 3;
  private readonly CHUNK_SIZE = 1024 * 1024; // 1MB chunks

  // File Validation
  validateFile(file: File, options: UploadOptions): FileValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Size validation
    const maxSize = options.maxSize || this.getDefaultMaxSize(options.category);
    if (file.size > maxSize) {
      errors.push(
        `File size (${this.formatFileSize(file.size)}) exceeds limit (${this.formatFileSize(maxSize)})`,
      );
    }

    // Type validation
    const allowedTypes =
      options.allowedTypes || this.getDefaultAllowedTypes(options.category);
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(
        `File type "${file.type}" is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      );
    }

    // File name validation
    if (file.name.length > 255) {
      errors.push("File name is too long (max 255 characters)");
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(file.name.replace(/\.[^/.]+$/, ""))) {
      warnings.push(
        "File name contains special characters that may cause issues",
      );
    }

    // Category specific validations
    switch (options.category) {
      case "avatar":
        if (!file.type.startsWith("image/")) {
          errors.push("Avatar must be an image file");
        }
        if (file.size > 5 * 1024 * 1024) {
          // 5MB
          errors.push("Avatar file size must be less than 5MB");
        }
        break;

      case "video":
        if (!file.type.startsWith("video/")) {
          errors.push("Must be a video file");
        }
        if (file.size > 500 * 1024 * 1024) {
          // 500MB
          warnings.push(
            "Large video files may take a long time to upload and process",
          );
        }
        break;

      case "document":
        const documentTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        if (!documentTypes.includes(file.type)) {
          errors.push("Document must be PDF, DOC, or DOCX format");
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Single File Upload
  async uploadFile(
    file: File,
    options: UploadOptions,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<FileUploadResponse> {
    // Validate file first
    const validation = this.validateFile(file, options);
    if (!validation.isValid) {
      throw new Error(
        `File validation failed: ${validation.errors.join(", ")}`,
      );
    }

    const fileId = this.generateFileId();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("category", options.category);
    formData.append("fileId", fileId);

    if (options.description)
      formData.append("description", options.description);
    if (options.tags) formData.append("tags", JSON.stringify(options.tags));
    if (options.makePublic !== undefined)
      formData.append("makePublic", String(options.makePublic));
    if (options.generateThumbnail !== undefined)
      formData.append("generateThumbnail", String(options.generateThumbnail));
    if (options.expiresIn)
      formData.append("expiresIn", String(options.expiresIn));

    try {
      // Initialize progress tracking
      const progressData: UploadProgress = {
        fileId,
        fileName: file.name,
        loaded: 0,
        total: file.size,
        percentage: 0,
        speed: 0,
        timeRemaining: 0,
        status: "uploading",
      };

      this.uploadProgress.set(fileId, progressData);

      const response = await this.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const loaded = progressEvent.loaded || 0;
            const total = progressEvent.total;
            const percentage = Math.round((loaded * 100) / total);

            // Calculate upload speed and time remaining
            const now = Date.now();
            const elapsed =
              (now - (progressData as any).startTime || now) / 1000;
            const speed = loaded / elapsed;
            const timeRemaining = speed > 0 ? (total - loaded) / speed : 0;

            const updatedProgress: UploadProgress = {
              ...progressData,
              loaded,
              percentage,
              speed,
              timeRemaining,
              status: percentage === 100 ? "processing" : "uploading",
            };

            this.uploadProgress.set(fileId, updatedProgress);
            onProgress?.(updatedProgress);
          }
        },
      });

      // Mark as completed
      const completedProgress: UploadProgress = {
        ...progressData,
        percentage: 100,
        status: "completed",
      };
      this.uploadProgress.set(fileId, completedProgress);
      onProgress?.(completedProgress);

      return response.data;
    } catch (error) {
      // Mark as error
      const errorProgress: UploadProgress = {
        ...this.uploadProgress.get(fileId)!,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      };
      this.uploadProgress.set(fileId, errorProgress);
      onProgress?.(errorProgress);

      console.error("File upload failed:", error);
      throw error;
    }
  }

  // Chunked Upload for Large Files
  async uploadLargeFile(
    file: File,
    options: UploadOptions,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<FileUploadResponse> {
    if (file.size < this.CHUNK_SIZE * 2) {
      // Use regular upload for smaller files
      return this.uploadFile(file, options, onProgress);
    }

    const fileId = this.generateFileId();
    const totalChunks = Math.ceil(file.size / this.CHUNK_SIZE);
    let uploadedBytes = 0;

    try {
      // Initialize upload session
      const initResponse = await this.post("/files/upload/init", {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        category: options.category,
        totalChunks,
        fileId,
      });

      const { uploadId } = initResponse.data;

      // Upload chunks
      const chunkPromises: Promise<any>[] = [];
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * this.CHUNK_SIZE;
        const end = Math.min(start + this.CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const chunkPromise = this.uploadChunk(
          uploadId,
          chunkIndex,
          chunk,
          (chunkProgress) => {
            uploadedBytes += chunkProgress;
            const totalProgress = Math.round((uploadedBytes * 100) / file.size);

            onProgress?.({
              fileId,
              fileName: file.name,
              loaded: uploadedBytes,
              total: file.size,
              percentage: totalProgress,
              speed: 0, // TODO: Calculate based on chunk speeds
              timeRemaining: 0,
              status: totalProgress === 100 ? "processing" : "uploading",
            });
          },
        );

        chunkPromises.push(chunkPromise);

        // Limit concurrent uploads
        if (chunkPromises.length >= this.MAX_CONCURRENT_UPLOADS) {
          await Promise.all(chunkPromises);
          chunkPromises.length = 0;
        }
      }

      // Wait for remaining chunks
      if (chunkPromises.length > 0) {
        await Promise.all(chunkPromises);
      }

      // Complete upload
      const completeResponse = await this.post(
        `/files/upload/${uploadId}/complete`,
        {
          ...options,
          fileId,
        },
      );

      onProgress?.({
        fileId,
        fileName: file.name,
        loaded: file.size,
        total: file.size,
        percentage: 100,
        speed: 0,
        timeRemaining: 0,
        status: "completed",
      });

      return completeResponse.data;
    } catch (error) {
      console.error("Chunked upload failed:", error);
      throw error;
    }
  }

  // Upload chunk helper
  private async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunk: Blob,
    onProgress: (bytesUploaded: number) => void,
  ): Promise<void> {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("chunkIndex", String(chunkIndex));

    await this.post(`/files/upload/${uploadId}/chunk`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        onProgress(progressEvent.loaded || 0);
      },
    });
  }

  // Bulk Upload
  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions,
    onProgress?: (overall: number, fileProgress: UploadProgress[]) => void,
  ): Promise<BulkUploadResult> {
    const startTime = Date.now();
    const successful: FileUploadResponse[] = [];
    const failed: Array<{ file: File; error: string }> = [];
    const fileProgressMap = new Map<string, UploadProgress>();

    const uploadPromises = files.map(async (file, index) => {
      try {
        const fileId = this.generateFileId();
        const result = await this.uploadFile(file, options, (progress) => {
          fileProgressMap.set(fileId, progress);

          // Calculate overall progress
          const allProgress = Array.from(fileProgressMap.values());
          const overallProgress =
            allProgress.reduce((sum, p) => sum + p.percentage, 0) /
            files.length;

          onProgress?.(overallProgress, allProgress);
        });

        successful.push(result);
      } catch (error) {
        failed.push({
          file,
          error: error instanceof Error ? error.message : "Upload failed",
        });
      }
    });

    await Promise.allSettled(uploadPromises);

    const uploadTime = Date.now() - startTime;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    return {
      successful,
      failed,
      totalFiles: files.length,
      totalSize,
      uploadTime,
    };
  }

  // File Management
  async getFiles(filters?: FileSearchFilters): Promise<{
    files: FileUploadResponse[];
    total: number;
    totalSize: number;
  }> {
    try {
      const params = filters ? new URLSearchParams(filters as any) : "";
      const response = await this.get(`/files?${params}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch files:", error);
      return this.getMockFiles();
    }
  }

  async getFile(fileId: string): Promise<FileUploadResponse> {
    try {
      const response = await this.get(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch file:", error);
      throw error;
    }
  }

  async updateFile(
    fileId: string,
    updates: Partial<FileMetadata>,
  ): Promise<FileUploadResponse> {
    try {
      const response = await this.put(`/files/${fileId}`, updates);
      return response.data;
    } catch (error) {
      console.error("Failed to update file:", error);
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.delete(`/files/${fileId}`);
    } catch (error) {
      console.error("Failed to delete file:", error);
      throw error;
    }
  }

  async getFilePermissions(fileId: string): Promise<FilePermissions> {
    try {
      const response = await this.get(`/files/${fileId}/permissions`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch file permissions:", error);
      return {
        canView: true,
        canDownload: true,
        canEdit: false,
        canDelete: false,
        canShare: false,
      };
    }
  }

  // File Processing
  async generateThumbnail(fileId: string): Promise<{ thumbnailUrl: string }> {
    try {
      const response = await this.post(`/files/${fileId}/thumbnail`);
      return response.data;
    } catch (error) {
      console.error("Failed to generate thumbnail:", error);
      throw error;
    }
  }

  async compressImage(
    fileId: string,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    },
  ): Promise<FileUploadResponse> {
    try {
      const response = await this.post(`/files/${fileId}/compress`, options);
      return response.data;
    } catch (error) {
      console.error("Failed to compress image:", error);
      throw error;
    }
  }

  // File Sharing
  async createShareLink(
    fileId: string,
    options: {
      expiresIn?: number; // hours
      password?: string;
      allowDownload?: boolean;
    },
  ): Promise<{ shareUrl: string; expiresAt: string }> {
    try {
      const response = await this.post(`/files/${fileId}/share`, options);
      return response.data;
    } catch (error) {
      console.error("Failed to create share link:", error);
      throw error;
    }
  }

  async revokeShareLink(fileId: string, shareId: string): Promise<void> {
    try {
      await this.delete(`/files/${fileId}/share/${shareId}`);
    } catch (error) {
      console.error("Failed to revoke share link:", error);
      throw error;
    }
  }

  // Analytics
  async getStorageAnalytics(): Promise<{
    totalFiles: number;
    totalSize: number;
    sizeByCategory: Record<FileCategory, number>;
    sizeByType: Record<string, number>;
    uploadTrends: Array<{ date: string; uploads: number; size: number }>;
    popularFormats: Array<{ format: string; count: number; size: number }>;
  }> {
    try {
      const response = await this.get("/files/analytics");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch storage analytics:", error);
      return this.getMockStorageAnalytics();
    }
  }

  // Utility Methods
  private generateFileId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private getDefaultMaxSize(category: FileCategory): number {
    switch (category) {
      case "avatar":
        return 5 * 1024 * 1024; // 5MB
      case "document":
        return 50 * 1024 * 1024; // 50MB
      case "video":
        return 500 * 1024 * 1024; // 500MB
      case "audio":
        return 100 * 1024 * 1024; // 100MB
      case "image":
        return 20 * 1024 * 1024; // 20MB
      default:
        return 100 * 1024 * 1024; // 100MB
    }
  }

  private getDefaultAllowedTypes(category: FileCategory): string[] {
    switch (category) {
      case "avatar":
      case "image":
        return ["image/jpeg", "image/png", "image/gif", "image/webp"];
      case "video":
        return ["video/mp4", "video/webm", "video/ogg", "video/avi"];
      case "audio":
        return ["audio/mp3", "audio/wav", "audio/ogg", "audio/aac"];
      case "document":
      case "lesson_material":
        return [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "text/plain",
        ];
      default:
        return []; // Allow all types
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎥";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word")) return "📝";
    if (mimeType.includes("sheet")) return "📊";
    if (mimeType.includes("presentation")) return "📽️";
    return "📎";
  }

  // Mock Data Methods
  private getMockFiles(): {
    files: FileUploadResponse[];
    total: number;
    totalSize: number;
  } {
    const mockFiles: FileUploadResponse[] = [
      {
        id: "1",
        fileName: "profile-avatar.jpg",
        originalName: "my-photo.jpg",
        size: 245760,
        mimeType: "image/jpeg",
        url: "/api/placeholder/150/150",
        thumbnailUrl: "/api/placeholder/50/50",
        uploadedAt: new Date().toISOString(),
        uploadedBy: 1,
        category: "avatar",
        metadata: { width: 150, height: 150, isPublic: true },
      },
      {
        id: "2",
        fileName: "lesson-plan.pdf",
        originalName: "English Lesson Plan.pdf",
        size: 1024000,
        mimeType: "application/pdf",
        url: "/files/lesson-plan.pdf",
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        uploadedBy: 2,
        category: "lesson_material",
        metadata: {
          description: "Advanced English grammar lesson",
          tags: ["english", "grammar", "advanced"],
        },
      },
    ];

    return {
      files: mockFiles,
      total: mockFiles.length,
      totalSize: mockFiles.reduce((sum, file) => sum + file.size, 0),
    };
  }

  private getMockStorageAnalytics() {
    return {
      totalFiles: 1543,
      totalSize: 2.4 * 1024 * 1024 * 1024, // 2.4GB
      sizeByCategory: {
        avatar: 156 * 1024 * 1024,
        document: 892 * 1024 * 1024,
        video: 1.2 * 1024 * 1024 * 1024,
        audio: 89 * 1024 * 1024,
        image: 234 * 1024 * 1024,
        lesson_material: 345 * 1024 * 1024,
        assignment: 78 * 1024 * 1024,
        certificate: 23 * 1024 * 1024,
        profile_document: 45 * 1024 * 1024,
      } as Record<FileCategory, number>,
      sizeByType: {
        "image/jpeg": 189 * 1024 * 1024,
        "image/png": 145 * 1024 * 1024,
        "video/mp4": 1.1 * 1024 * 1024 * 1024,
        "application/pdf": 567 * 1024 * 1024,
        "audio/mp3": 78 * 1024 * 1024,
      },
      uploadTrends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
        uploads: Math.floor(Math.random() * 50) + 10,
        size: Math.floor(Math.random() * 100) * 1024 * 1024,
      })).reverse(),
      popularFormats: [
        { format: "PDF", count: 456, size: 567 * 1024 * 1024 },
        { format: "JPEG", count: 389, size: 189 * 1024 * 1024 },
        { format: "MP4", count: 234, size: 1.1 * 1024 * 1024 * 1024 },
        { format: "PNG", count: 167, size: 145 * 1024 * 1024 },
        { format: "MP3", count: 123, size: 78 * 1024 * 1024 },
      ],
    };
  }
}

export const fileUploadService = new FileUploadService();
