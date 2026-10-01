import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50 text-gray-900">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4 font-heading">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Page Not Found / Trang không tồn tại
      </h2>
      <p className="max-w-md text-gray-600 mb-8 leading-relaxed">
        The page you are looking for might have been moved, renamed, or doesn't exist.
      </p>
      <Link
        href="/vi/"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm focus:ring-4 focus:ring-red-300 transition-colors shadow-xs"
      >
        <span>Quay về trang chủ / Return Home</span>
      </Link>
    </div>
  );
}
