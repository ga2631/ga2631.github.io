import React from 'react';
import { Blog as BlogSection, type BlogProps } from '../components/Blog.tsx';

export type { BlogProps };

export const Blog: React.FC<BlogProps> = (props) => {
  return <BlogSection {...props} />;
};

Blog.displayName = 'Blog';
export default Blog;
