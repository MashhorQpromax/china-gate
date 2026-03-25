'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';

interface FileUploadProps {
  onFile: (file: File) => void;
  label?: string;
  label_ar?: string;
  accept?: string;
  maxSize?: number; // in MB
  preview?: string;
  error?: string;
  required?: boolean;
  dir?: 'ltr' | 'rtl';
}

export function FileUpload({
  onFile,
  label = 'Upload File',
  label_ar = 'رفع ملف',
  accept = 'image/*',
  maxSize = 5,
  preview,
  error,
  required = false,
  dir = 'rtl',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isRTL = dir === 'rtl';

  const handleFile = (file: File) => {
    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSize) {
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    onFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setFileSize(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {isRTL ? label_ar : label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {previewUrl ? (
        // Preview State
        <div className="relative">
          <div className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
          >
            <X size={16} />
          </button>
          {fileName && (
            <p className="mt-2 text-sm text-gray-400">
              {fileName} ({(fileSize! / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      ) : (
        // Upload Zone
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isDragging
              ? 'border-red-500 bg-red-500 bg-opacity-10'
              : 'border-gray-600 bg-gray-800 hover:border-gray-500'
          } ${error ? 'border-red-500' : ''}`}
        >
          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-gray-300 font-medium mb-1">
            {isRTL ? 'اسحب الملف هنا أو انقر للاختيار' : 'Drag file here or click to select'}
          </p>
          <p className="text-xs text-gray-400">
            {isRTL ? `الحد الأقصى ${maxSize} MB` : `Max ${maxSize} MB`}
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}
