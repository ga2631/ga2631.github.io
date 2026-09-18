import { BlogPost } from '../types/index.ts';

import enBlog from './locales/en/blog.json';
import viBlog from './locales/vi/blog.json';

export const blogPostsEn: BlogPost[] = enBlog as BlogPost[];
export const blogPostsVi: BlogPost[] = viBlog as BlogPost[];

export const blogPosts: BlogPost[] = blogPostsEn;
