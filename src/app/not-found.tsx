import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50 text-slate-900">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4 font-heading">
        404
      </h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Page Not Found / Trang không tồn tại
      </h2>
      <p className="max-w-md text-slate-600 mb-8 leading-relaxed">
        The page you are looking for might have been moved, renamed, or doesn't exist.
      </p>
      <Link
        href="/vi/"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
      >
        <span>Quay về trang chủ / Return Home</span>
      </Link>
    </div>
  );
}
