import { Suspense } from 'react';
import { BlogLayout } from '@/components/layouts/BlogLayout';
import { BlogView } from '@/views/Blog';

export default function BlogLoading() {
  return (
    <BlogLayout fixedHeight={true}>
      <Suspense fallback={null}>
        <BlogView initialPosts={[]} initialCategories={[]} />
      </Suspense>
    </BlogLayout>
  );
}
