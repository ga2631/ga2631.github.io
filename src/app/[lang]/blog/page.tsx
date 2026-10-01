import { Metadata } from 'next';
import { BlogLayout } from '@/components/layouts/BlogLayout';
import { BlogView } from '@/views/Blog';
import { getBlogPosts, getBlogCategories } from '@/services/blogService';
import { buildDynamicMetadata } from '@/utils/seo';
import { supportedLocales } from '@/i18n/config';

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const isEn = lang === 'en';

  return buildDynamicMetadata({
    locale: lang,
    path: 'blog',
    title: isEn
      ? 'Tech Blog & Architecture Notes | Huynh Nhat Tan'
      : 'Blog Kỹ Thuật & Ghi Chép Kiến Trúc | Huỳnh Nhật Tân',
    description: isEn
      ? 'System architecture, high-concurrency solutions, medallion data warehouses, and modern engineering practices.'
      : 'Ghi chép chuyên sâu về kiến trúc hệ thống phân tán, xử lý tải cao, data warehouse và bài học kỹ thuật thực chiến.',
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  let initialPosts: any[] = [];
  let initialCategories: any[] = [];

  try {
    [initialPosts, initialCategories] = await Promise.all([
      getBlogPosts(lang),
      getBlogCategories(),
    ]);
  } catch {
    // Graceful fallback for SSR/build
  }

  return (
    <BlogLayout>
      <BlogView initialPosts={initialPosts} initialCategories={initialCategories} />
    </BlogLayout>
  );
}
