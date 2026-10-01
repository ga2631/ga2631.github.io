import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogLayout } from '@/components/layouts/BlogLayout';
import { BlogPostDetailView } from '@/views/Blog/BlogPostDetail';
import { getBlogPostBySlug, getBlogPosts } from '@/services/blogService';
import { buildDynamicMetadata } from '@/utils/seo';
import { supportedLocales } from '@/i18n/config';

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  for (const lang of supportedLocales) {
    try {
      const posts = await getBlogPosts(lang);
      posts.forEach((post) => {
        if (post.slug) {
          params.push({ lang, slug: post.slug });
        }
      });
    } catch {
      // Graceful fallback for static build
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }> | { lang: string; slug: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;

  try {
    const post = await getBlogPostBySlug(slug, lang);
    if (post) {
      return buildDynamicMetadata({
        locale: lang,
        path: `blog/${slug}`,
        title: `${post.title} | Huỳnh Nhật Tân`,
        description: post.summary || 'Technical article on system architecture and software engineering.',
        type: 'article',
        publishedTime: post.publishedAt,
      });
    }
  } catch {
    // ignore
  }

  return buildDynamicMetadata({
    locale: lang,
    path: `blog/${slug}`,
    title: 'Article | Huỳnh Nhật Tân',
    description: 'Technical article on system architecture.',
  });
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }> | { lang: string; slug: string };
}) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;

  let post = null;
  try {
    post = await getBlogPostBySlug(slug, lang);
  } catch {
    // fallback
  }

  if (!post) {
    // Try to provide minimal fallback placeholder if rendering dynamically
    return (
      <BlogLayout>
        <div className="py-24 text-center glass-panel p-8 rounded-3xl max-w-lg mx-auto border border-gray-800 space-y-4">
          <div className="text-3xl">📄</div>
          <h2 className="text-xl font-bold text-white">Bài viết không tồn tại</h2>
          <p className="text-xs text-gray-400">
            Không tìm thấy bài viết với đường dẫn <code>{slug}</code> trên cơ sở dữ liệu Supabase.
          </p>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      <BlogPostDetailView post={post} />
    </BlogLayout>
  );
}
