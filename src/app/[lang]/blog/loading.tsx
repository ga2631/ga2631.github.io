import { BlogLayout } from '@/components/layouts/BlogLayout';
import { BlogView } from '@/views/Blog';

export default function BlogLoading() {
  return (
    <BlogLayout fixedHeight={true}>
      <BlogView initialPosts={[]} initialCategories={[]} />
    </BlogLayout>
  );
}
