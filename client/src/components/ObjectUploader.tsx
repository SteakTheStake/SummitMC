import { useState, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: { successful: Array<{ uploadURL: string; name: string }> }) => void;
  buttonClassName?: string;
  children: ReactNode;
  accept?: string;
}

export function ObjectUploader({
  maxNumberOfFiles = 1,
  maxFileSize = 10485760, // 10MB default
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
  accept = "image/*",
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (files: FileList) => {
    setError(null);
    
    if (!files || files.length === 0) {
      setSelectedFiles([]);
      setPreviewUrls([]);
      return;
    }

    // Validate file count
    if (files.length > maxNumberOfFiles) {
      setError(`Maximum ${maxNumberOfFiles} file(s) allowed`);
      return;
    }

    const fileArray = Array.from(files);
    
    // Validate file sizes
    for (const file of fileArray) {
      if (file.size > maxFileSize) {
        setError(`File ${file.name} is too large. Maximum size: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`);
        return;
      }
    }

    setSelectedFiles(fileArray);
    
    // Generate preview URLs for images
    const urls = fileArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const results = [];

      for (const file of selectedFiles) {
        // Get upload parameters
        const { url, method } = await onGetUploadParameters();

        // Upload file
        const uploadResponse = await fetch(url, {
          method,
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.statusText}`);
        }

        results.push({
          uploadURL: url.split('?')[0], // Remove query parameters to get clean URL
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }

      // Call completion callback
      onComplete?.({ successful: results });
      
      // Reset form
      clearSelection();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFiles([]);
    setError(null);
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Drop image files here or click to browse
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Maximum {maxNumberOfFiles} file(s), up to {(maxFileSize / 1024 / 1024).toFixed(1)}MB each
        </p>
        
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={buttonClassName}
          disabled={isUploading}
          variant="outline"
        >
          <Upload className="mr-2" size={16} />
          {children}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxNumberOfFiles > 1}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          {/* File Previews */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="bg-slate-800 p-3 rounded-lg">
                <div className="aspect-square bg-slate-700 rounded mb-2 overflow-hidden">
                  {previewUrls[index] && (
                    <img
                      src={previewUrls[index]}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="text-xs text-slate-300 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Uploading...
                </>
              ) : (
                `Upload ${selectedFiles.length} file(s)`
              )}
            </Button>
            
            <Button variant="outline" onClick={clearSelection} disabled={isUploading}>
              <X className="mr-2" size={16} />
              Clear
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}