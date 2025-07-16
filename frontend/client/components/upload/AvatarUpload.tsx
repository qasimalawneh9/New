import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  X,
  Crop,
  RotateCw,
  Check,
  Loader2,
} from "lucide-react";
import {
  fileUploadService,
  FileUploadResponse,
} from "../../api/services/file-upload.service";

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange?: (avatar: FileUploadResponse) => void;
  onError?: (error: string) => void;
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  allowCrop?: boolean;
  className?: string;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  onError,
  size = "lg",
  disabled = false,
  allowCrop = true,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropData, setCropData] = useState<CropData>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    scale: 1,
    rotation: 0,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = fileUploadService.validateFile(file, {
      category: "avatar",
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    });

    if (!validation.isValid) {
      onError?.(validation.errors.join(", "));
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    if (allowCrop) {
      setShowCropModal(true);
    } else {
      // Upload directly without cropping
      uploadAvatar(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadAvatar = async (file: File, croppedBlob?: Blob) => {
    try {
      setIsUploading(true);

      const uploadFile = croppedBlob
        ? new File([croppedBlob], file.name, { type: file.type })
        : file;

      const result = await fileUploadService.uploadFile(uploadFile, {
        category: "avatar",
        generateThumbnail: true,
        makePublic: true,
        description: "User avatar",
      });

      onAvatarChange?.(result);
      setShowCropModal(false);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error) {
      console.error("Avatar upload failed:", error);
      onError?.(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCrop = () => {
    if (!canvasRef.current || !imageRef.current || !selectedFile) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = imageRef.current;
    const { x, y, width, height, scale, rotation } = cropData;

    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Draw cropped image
    ctx.drawImage(
      image,
      x,
      y,
      width,
      height,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height,
    );
    ctx.restore();

    // Convert to blob and upload
    canvas.toBlob(
      (blob) => {
        if (blob) {
          uploadAvatar(selectedFile, blob);
        }
      },
      selectedFile.type,
      0.9,
    );
  };

  const updateCropData = (updates: Partial<CropData>) => {
    setCropData((prev) => ({ ...prev, ...updates }));
  };

  const resetCrop = () => {
    setCropData({
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      scale: 1,
      rotation: 0,
    });
  };

  const removeAvatar = async () => {
    if (
      currentAvatar &&
      confirm("Are you sure you want to remove your avatar?")
    ) {
      try {
        // This would call an API to remove the avatar
        onAvatarChange?.(null as any);
      } catch (error) {
        onError?.("Failed to remove avatar");
      }
    }
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Avatar Display */}
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 relative group`}
        >
          {currentAvatar ? (
            <img
              src={currentAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className={`${iconSizes[size]} mx-auto mb-1`}>👤</div>
                {size === "lg" || size === "xl" ? (
                  <span className="text-xs">No avatar</span>
                ) : null}
              </div>
            </div>
          )}

          {/* Upload Overlay */}
          {!disabled && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className={`${iconSizes[size]} text-white`} />
            </div>
          )}

          {/* Loading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader2
                className={`${iconSizes[size]} text-white animate-spin`}
              />
            </div>
          )}
        </div>

        {/* Upload Button */}
        {!disabled && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 shadow-lg"
            disabled={isUploading}
          >
            <Camera className="w-3 h-3" />
          </button>
        )}

        {/* Remove Button */}
        {currentAvatar && !disabled && (
          <button
            onClick={removeAvatar}
            className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-lg"
            disabled={isUploading}
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
      </div>

      {/* Crop Modal */}
      {showCropModal && previewUrl && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Crop Avatar
              </h3>
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setPreviewUrl(null);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview */}
            <div
              className="relative bg-gray-100 rounded-lg overflow-hidden mb-4"
              style={{ height: "300px" }}
            >
              <img
                ref={imageRef}
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${cropData.scale}) rotate(${cropData.rotation}deg)`,
                  transformOrigin: "center",
                }}
              />

              {/* Crop Overlay */}
              <div
                className="absolute border-2 border-white shadow-lg pointer-events-none"
                style={{
                  left: `${cropData.x}px`,
                  top: `${cropData.y}px`,
                  width: `${cropData.width}px`,
                  height: `${cropData.height}px`,
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* Crop Controls */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scale
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={cropData.scale}
                  onChange={(e) =>
                    updateCropData({ scale: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={cropData.rotation}
                    onChange={(e) =>
                      updateCropData({ rotation: parseInt(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <button
                    onClick={() =>
                      updateCropData({
                        rotation: (cropData.rotation + 90) % 360,
                      })
                    }
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={resetCrop}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Reset
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowCropModal(false);
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCrop}
                  disabled={isUploading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{isUploading ? "Uploading..." : "Save Avatar"}</span>
                </button>
              </div>
            </div>

            {/* Hidden Canvas for Cropping */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarUpload;
