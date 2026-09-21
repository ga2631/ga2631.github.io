import { BlogPost } from '../types/index.ts';
import {
  getEagerPosts,
  loadInitialBlogPosts,
  loadNextMonthBatch,
  loadAllArchivePosts,
  getAvailableMonthArchives,
  isPostPublished,
  getLocalDateString,
} from '../services/blogService.ts';

export {
  loadInitialBlogPosts,
  loadNextMonthBatch,
  loadAllArchivePosts,
  getAvailableMonthArchives,
  isPostPublished,
  getLocalDateString,
};

// Eagerly loaded posts for initial synchronous render, fast SSR, and test suites
export const blogPostsEn: BlogPost[] = getEagerPosts('en');
export const blogPostsVi: BlogPost[] = getEagerPosts('vi');

export const blogPosts: BlogPost[] = blogPostsEn;
