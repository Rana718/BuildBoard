import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
}

export function FileUpload({ 
  onUpload, 
  accept = 'image/*', 
  maxSize = 5 * 1024 * 1024, // 5MB
  className = '',
  children 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: `File size should be less than ${maxSize / (1024 * 1024)}MB`,
        variant: 'error',
      });
      return;
    }

    setUploading(true);
    
    try {
      const url = await uploadToCloudinary(file);
      setUploadedFile(url);
      onUpload(url);
      toast({
        title: 'Upload successful',
        description: 'File has been uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'error',
      });
    } finally {
      setUploading(false);
    }
  }, [maxSize, onUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => {
      acc[type.trim()] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxFiles: 1,
    disabled: uploading,
  });

  const removeFile = () => {
    setUploadedFile(null);
    onUpload('');
  };

  if (children) {
    return (
      <div {...getRootProps()} className={className}>
        <input {...getInputProps()} />
        {children}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {uploading ? (
            <p className="text-sm text-gray-600">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-sm text-gray-600">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Drag & drop a file here, or click to select
              </p>
              <p className="text-xs text-gray-400">
                Max size: {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            <FileIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">File uploaded</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
