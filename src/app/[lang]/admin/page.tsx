'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LangAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center space-y-3" role="status">
        <i className="fa-solid fa-circle-notch fa-spin text-xl text-red-600"></i>
        <p className="text-xs text-gray-500 font-medium">Đang chuyển tiếp tới CMS Studio...</p>
      </div>
    </div>
  );
}
