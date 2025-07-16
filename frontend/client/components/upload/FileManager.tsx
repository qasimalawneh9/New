import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Download,
  Trash2,
  Share2,
  Edit3,
  Eye,
  MoreVertical,
  Upload,
  Folder,
  SortAsc,
  SortDesc,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  File,
} from "lucide-react";
import {
  fileUploadService,
  FileUploadResponse,
  FileCategory,
  FileSearchFilters,
} from "../../api/services/file-upload.service";
import FileUploader from "./FileUploader";

interface FileManagerProps {
  userId?: number;
  category?: FileCategory;
  allowUpload?: boolean;
  allowDelete?: boolean;
  allowShare?: boolean;
  selectable?: boolean;
  onFileSelect?: (files: FileUploadResponse[]) => void;
  className?: string;
}

type ViewMode = "grid" | "list";
type SortField = "name" | "size" | "date" | "type";
type SortOrder = "asc" | "desc";

export const FileManager: React.FC<FileManagerProps> = ({
  userId,
  category,
  allowUpload = true,
  allowDelete = false,
  allowShare = false,
  selectable = false,
  onFileSelect,
  className = "",
}) => {
  const [files, setFiles] = useState<FileUploadResponse[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileUploadResponse[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FileSearchFilters>({
    category,
    uploadedBy: userId,
  });

  // Statistics
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    sizeByType: {} as Record<string, number>,
  });

  useEffect(() => {
    loadFiles();
  }, [filters]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [files, searchQuery, sortField, sortOrder]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fileUploadService.getFiles(filters);
      setFiles(response.files);
      setStats({
        totalFiles: response.total,
        totalSize: response.totalSize,
        sizeByType: response.files.reduce(
          (acc, file) => {
            acc[file.mimeType] = (acc[file.mimeType] || 0) + file.size;
            return acc;
          },
          {} as Record<string, number>,
        ),
      });
    } catch (error) {
      console.error("Failed to load files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...files];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (file) =>
          file.fileName.toLowerCase().includes(query) ||
          file.originalName.toLowerCase().includes(query) ||
          file.metadata?.description?.toLowerCase().includes(query) ||
          file.metadata?.tags?.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.fileName.toLowerCase();
          bValue = b.fileName.toLowerCase();
          break;
        case "size":
          aValue = a.size;
          bValue = b.size;
          break;
        case "date":
          aValue = new Date(a.uploadedAt);
          bValue = new Date(b.uploadedAt);
          break;
        case "type":
          aValue = a.mimeType;
          bValue = b.mimeType;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredFiles(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleFileSelect = (fileId: string, selected: boolean) => {
    const newSelected = new Set(selectedFiles);
    if (selected) {
      newSelected.add(fileId);
    } else {
      newSelected.delete(fileId);
    }
    setSelectedFiles(newSelected);

    if (onFileSelect) {
      const selectedFileObjects = files.filter((file) =>
        newSelected.has(file.id),
      );
      onFileSelect(selectedFileObjects);
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
      onFileSelect?.([]);
    } else {
      const allIds = new Set(filteredFiles.map((file) => file.id));
      setSelectedFiles(allIds);
      onFileSelect?.(filteredFiles);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!allowDelete) return;

    if (
      confirm(
        "Are you sure you want to delete this file? This action cannot be undone.",
      )
    ) {
      try {
        await fileUploadService.deleteFile(fileId);
        setFiles((prev) => prev.filter((file) => file.id !== fileId));
        setSelectedFiles((prev) => {
          const newSelected = new Set(prev);
          newSelected.delete(fileId);
          return newSelected;
        });
      } catch (error) {
        console.error("Failed to delete file:", error);
        alert("Failed to delete file. Please try again.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!allowDelete || selectedFiles.size === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedFiles.size} file(s)? This action cannot be undone.`,
      )
    ) {
      try {
        await Promise.all(
          Array.from(selectedFiles).map((fileId) =>
            fileUploadService.deleteFile(fileId),
          ),
        );
        setFiles((prev) => prev.filter((file) => !selectedFiles.has(file.id)));
        setSelectedFiles(new Set());
        onFileSelect?.([]);
      } catch (error) {
        console.error("Failed to delete files:", error);
        alert("Failed to delete some files. Please try again.");
      }
    }
  };

  const handleShareFile = async (fileId: string) => {
    if (!allowShare) return;

    try {
      const result = await fileUploadService.createShareLink(fileId, {
        expiresIn: 24,
        allowDownload: true,
      });

      // Copy to clipboard
      await navigator.clipboard.writeText(result.shareUrl);
      alert("Share link copied to clipboard!");
    } catch (error) {
      console.error("Failed to create share link:", error);
      alert("Failed to create share link. Please try again.");
    }
  };

  const getFileIcon = (mimeType: string, size: "sm" | "md" | "lg" = "md") => {
    const sizeClass =
      size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8";

    if (mimeType.startsWith("image/")) return <Image className={sizeClass} />;
    if (mimeType.startsWith("video/")) return <Video className={sizeClass} />;
    if (mimeType.startsWith("audio/")) return <Music className={sizeClass} />;
    if (mimeType.includes("pdf") || mimeType.includes("document"))
      return <FileText className={sizeClass} />;
    return <File className={sizeClass} />;
  };

  const formatFileSize = (bytes: number) =>
    fileUploadService.formatFileSize(bytes);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {filteredFiles.map((file) => (
        <div
          key={file.id}
          className={`relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${
            selectedFiles.has(file.id)
              ? "ring-2 ring-blue-500 border-blue-500"
              : ""
          }`}
          onClick={() =>
            selectable && handleFileSelect(file.id, !selectedFiles.has(file.id))
          }
        >
          {selectable && (
            <input
              type="checkbox"
              checked={selectedFiles.has(file.id)}
              onChange={(e) => handleFileSelect(file.id, e.target.checked)}
              className="absolute top-2 left-2 rounded"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          <div className="flex flex-col items-center space-y-2">
            {/* File Preview/Icon */}
            <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg">
              {file.thumbnailUrl ? (
                <img
                  src={file.thumbnailUrl}
                  alt={file.fileName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400">
                  {getFileIcon(file.mimeType, "lg")}
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="text-center w-full">
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={file.fileName}
              >
                {file.fileName}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-1 text-gray-400 hover:text-blue-500"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                className="p-1 text-gray-400 hover:text-green-500"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              {allowShare && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareFile(file.id);
                  }}
                  className="p-1 text-gray-400 hover:text-yellow-500"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
              {allowDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="w-8 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selectedFiles.size === filteredFiles.length &&
                    filteredFiles.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
            )}
            <th className="text-left px-4 py-3">
              <button
                onClick={() => handleSort("name")}
                className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                <span>Name</span>
                {sortField === "name" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  ))}
              </button>
            </th>
            <th className="text-left px-4 py-3">
              <button
                onClick={() => handleSort("size")}
                className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                <span>Size</span>
                {sortField === "size" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  ))}
              </button>
            </th>
            <th className="text-left px-4 py-3">
              <button
                onClick={() => handleSort("type")}
                className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                <span>Type</span>
                {sortField === "type" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  ))}
              </button>
            </th>
            <th className="text-left px-4 py-3">
              <button
                onClick={() => handleSort("date")}
                className="flex items-center space-x-1 text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                <span>Modified</span>
                {sortField === "date" &&
                  (sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4" />
                  ) : (
                    <SortDesc className="w-4 h-4" />
                  ))}
              </button>
            </th>
            <th className="w-16 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredFiles.map((file) => (
            <tr
              key={file.id}
              className={`hover:bg-gray-50 ${selectedFiles.has(file.id) ? "bg-blue-50" : ""}`}
            >
              {selectable && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={(e) =>
                      handleFileSelect(file.id, e.target.checked)
                    }
                    className="rounded"
                  />
                </td>
              )}
              <td className="px-4 py-3">
                <div className="flex items-center space-x-3">
                  {file.thumbnailUrl ? (
                    <img
                      src={file.thumbnailUrl}
                      alt={file.fileName}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <div className="text-gray-400">
                      {getFileIcon(file.mimeType)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.fileName}
                    </p>
                    {file.metadata?.description && (
                      <p className="text-xs text-gray-500">
                        {file.metadata.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {formatFileSize(file.size)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {file.mimeType.split("/")[1]?.toUpperCase() || "Unknown"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {formatDate(file.uploadedAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-1">
                  <button
                    className="p-1 text-gray-400 hover:text-blue-500"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 text-gray-400 hover:text-green-500"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {allowShare && (
                    <button
                      onClick={() => handleShareFile(file.id)}
                      className="p-1 text-gray-400 hover:text-yellow-500"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                  {allowDelete && (
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">File Manager</h2>
          <p className="text-sm text-gray-500">
            {stats.totalFiles} files • {formatFileSize(stats.totalSize)}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {allowUpload && (
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
          )}

          {selectedFiles.size > 0 && allowDelete && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete ({selectedFiles.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      {showUploader && allowUpload && (
        <div className="border border-gray-200 rounded-lg p-6">
          <FileUploader
            category={category || "document"}
            multiple={true}
            onUploadComplete={(files) => {
              setFiles((prev) => [...files, ...prev]);
              setShowUploader(false);
            }}
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-500"}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-500"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    category: (e.target.value as FileCategory) || undefined,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="avatar">Avatar</option>
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="image">Image</option>
                <option value="lesson_material">Lesson Material</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select
                value={filters.fileType || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    fileType: e.target.value || undefined,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="application/pdf">PDF</option>
                <option value="video/mp4">MP4</option>
                <option value="audio/mp3">MP3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size Range
              </label>
              <select
                onChange={(e) => {
                  const [min, max] = e.target.value.split("-").map(Number);
                  setFilters((prev) => ({
                    ...prev,
                    minSize: min || undefined,
                    maxSize: max || undefined,
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sizes</option>
                <option value="0-1048576">Under 1MB</option>
                <option value="1048576-10485760">1MB - 10MB</option>
                <option value="10485760-104857600">10MB - 100MB</option>
                <option value="104857600-">Over 100MB</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading files...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No files found
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Upload some files to get started"}
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? renderGridView() : renderListView()}

          {/* Pagination would go here */}
          <div className="flex justify-center">
            <p className="text-sm text-gray-500">
              Showing {filteredFiles.length} of {stats.totalFiles} files
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FileManager;
