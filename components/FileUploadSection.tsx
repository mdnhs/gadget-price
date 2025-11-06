"use client";

import React, { ChangeEvent, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FileUploadSectionProps {
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export default function FileUploadSection({
  onFileUpload,
  loading,
}: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-200 py-12 text-center">
      {" "}
      <CardContent className="p-0">
        {" "}
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4">
          {loading ? (
            <Loader2 size={32} className="animate-spin" />
          ) : (
            <Upload size={32} />
          )}{" "}
        </div>
        ```
        <h3 className="text-lg font-medium text-gray-800 mb-2">Get Started</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-5 text-sm">
          Upload an Excel or CSV file to import your product catalog.
        </p>
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={onFileUpload}
          disabled={loading}
          className="hidden"
        />
        <Button
          onClick={handleClick}
          disabled={loading}
          variant="outline"
          className={cn(
            "mx-auto w-48 flex items-center justify-center gap-2 text-sm border-dashed",
            loading && "opacity-60 cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {loading ? "Uploading..." : "Upload File"}
        </Button>
        <p className="text-xs text-gray-500 mt-3">.xlsx, .xls, .csv</p>
        <div className="text-left max-w-lg mx-auto bg-gray-50 p-4 rounded-lg text-xs text-gray-700 mt-6">
          <p className="font-medium mb-1">Required columns:</p>
          <p className="text-gray-600">
            id, product_no, category, brand, name, warranty, dp_price, rp_price,
            map_price, mrp_price, url
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
