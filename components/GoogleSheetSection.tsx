import React from "react";
import { Download } from "lucide-react";

interface GoogleSheetSectionProps {
  googleSheetUrl: string;
  setGoogleSheetUrl: (url: string) => void;
  onGoogleSheetLoad: () => void;
  loading: boolean;
}

export default function GoogleSheetSection({
  googleSheetUrl,
  setGoogleSheetUrl,
  onGoogleSheetLoad,
  loading,
}: GoogleSheetSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-gray-800 mb-2">Google Sheets</h3>
      <p className="text-xs text-gray-600 mb-3">Paste public URL</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={googleSheetUrl}
          onChange={(e) => setGoogleSheetUrl(e.target.value)}
          placeholder="https://docs.google.com/spreadsheets/d/...  "
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <button
          onClick={onGoogleSheetLoad}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center gap-1"
        >
          <Download size={16} /> Load
        </button>
      </div>
    </div>
  );
}
