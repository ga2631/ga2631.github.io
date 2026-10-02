'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xs">
          <div className="text-3xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
          <p className="text-xs text-gray-500 mb-6">{error?.message || 'An unexpected error occurred.'}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
