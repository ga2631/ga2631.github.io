import { BlogLayout } from '@/components/layouts/BlogLayout';
import { BlogPostDetailSkeleton } from '@/views/Blog/BlogPostDetail';

export default function BlogPostDetailLoading() {
  return (
    <BlogLayout>
      <BlogPostDetailSkeleton />
    </BlogLayout>
  );
}
