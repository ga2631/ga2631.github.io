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
    <html lang="vi">
      <body className="bg-[#fafafa] text-gray-800 font-sans min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-600 text-sm mb-4">
            {error?.message || 'Có lỗi bất ngờ xảy ra khi tải trang.'}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
