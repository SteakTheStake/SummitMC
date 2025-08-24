import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";

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
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setError(null);
    
    if (!files || files.length === 0) {
      setSelectedFiles(null);
      return;
    }

    // Validate file count
    if (files.length > maxNumberOfFiles) {
      setError(`Maximum ${maxNumberOfFiles} file(s) allowed`);
      return;
    }

    // Validate file sizes
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxFileSize) {
        setError(`File ${files[i].name} is too large. Maximum size: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`);
        return;
      }
    }

    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const results = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
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
        });
      }

      // Call completion callback
      onComplete?.({ successful: results });
      
      // Reset form
      setSelectedFiles(null);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFiles(null);
    setError(null);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={() => document.getElementById('file-upload')?.click()}
          className={buttonClassName}
          disabled={isUploading}
        >
          <Upload className="mr-2" size={16} />
          {children}
        </Button>
        
        <input
          id="file-upload"
          type="file"
          multiple={maxNumberOfFiles > 1}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {selectedFiles && selectedFiles.length > 0 && (
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
        )}
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Selected Files:</span>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              <X size={16} />
            </Button>
          </div>
          <div className="space-y-1">
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="text-sm text-slate-300 flex justify-between">
                <span>{file.name}</span>
                <span>{(file.size / 1024 / 1024).toFixed(1)}MB</span>
              </div>
            ))}
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