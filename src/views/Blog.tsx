'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button, Badge, Card, TextInput, Spinner, Drawer, DrawerHeader, DrawerItems } from 'flowbite-react';
import { BlogPost } from '../types/index.ts';
import {
  BookOpenIcon,
  CalendarIcon,
  FilterIcon,
  TagIcon,
  SearchIcon,
  CloseIcon,
  LayersIcon,
  DatabaseIcon,
  ServerIcon,
  CodeIcon,
  SparklesIcon,
} from '../components/Icons.tsx';
import { UITranslation } from '../i18n';
import {
  loadInitialBlogPosts,
  loadNextMonthBatch,
  loadAllArchivePosts,
  getPostContentHtml,
  getBlogCategories,
  BlogCategoryDef,
} from '../services/blogService';
import { BlogModal, processArticleToc } from '../components/BlogModal';
import {
  trackBlogPostView,
  trackBlogSearch,
  trackBlogCategoryFilter,
  trackBlogTagClick,
} from '../utils/analytics';

export interface BlogProps {
  posts: BlogPost[];
  categories?: BlogCategoryDef[];
  t: UITranslation['blog'];
  tCommon: UITranslation['common'];
}

export const renderCategoryIcon = (iconName: string, size = 15) => {
  switch (iconName) {
    case 'LayersIcon':
      return <LayersIcon size={size} />;
    case 'DatabaseIcon':
      return <DatabaseIcon size={size} />;
    case 'ServerIcon':
      return <ServerIcon size={size} />;
    case 'CodeIcon':
      return <CodeIcon size={size} />;
    case 'SparklesIcon':
      return <SparklesIcon size={size} />;
    default:
      return <BookOpenIcon size={size} />;
  }
};

export const getDayColor = (code: string): 'warning' | 'purple' | 'info' | 'success' | 'failure' | 'gray' => {
  const c = code.toLowerCase();
  if (c === 't2' || c === 'mon') return 'warning';
  if (c === 't3' || c === 'tue') return 'purple';
  if (c === 't4' || c === 'wed') return 'info';
  if (c === 't5' || c === 'thu') return 'success';
  if (c === 't6' || c === 'fri') return 'failure';
  return 'gray';
};

export const Blog: React.FC<BlogProps> = ({ posts, categories, t, tCommon }) => {
  const langKey = useMemo<'vi' | 'en'>(() => {
    return t.allTopics === 'Tất cả chủ đề' || !t.allTopics.toLowerCase().includes('all') ? 'vi' : 'en';
  }, [t.allTopics]);

  const [categoriesList, setCategoriesList] = useState<BlogCategoryDef[]>(() => categories || []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoriesList(categories);
    } else {
      getBlogCategories().then((cats) => {
        setCategoriesList(cats);
      });
    }
  }, [categories]);

  const [fullCatalog, setFullCatalog] = useState<BlogPost[]>(() => posts || []);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(() => (posts || []).slice(0, 20));
  const [hasMoreMonths, setHasMoreMonths] = useState<boolean>(() => (posts || []).length > 20);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (posts && posts.length > 0) {
      setFullCatalog(posts);
      setDisplayedPosts(posts.slice(0, 20));
      setHasMoreMonths(posts.length > 20);
      setActivePost((prev) => {
        if (!prev) return null;
        return posts.find((p) => p.slug === prev.slug || p.id === prev.id) || prev;
      });
    }
  }, [posts]);

  useEffect(() => {
    let isMounted = true;
    loadInitialBlogPosts(langKey, 20).then((res) => {
      if (isMounted) {
        setDisplayedPosts(res.posts);
        setHasMoreMonths(res.hasMore);
      }
    });
    loadAllArchivePosts(langKey).then((all) => {
      if (isMounted) {
        setFullCatalog(all);
        setHasMoreMonths(all.length > 20);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [langKey]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreMonths) return;
    setIsLoadingMore(true);
    try {
      const res = await loadNextMonthBatch(langKey, displayedPosts.length, 20);
      setDisplayedPosts((prev) => {
        const existingKeys = new Set(prev.map((p) => p.slug || p.id));
        const newUnique = res.posts.filter((p) => !existingKeys.has(p.slug || p.id));
        const updated = [...prev, ...newUnique];
        setHasMoreMonths(updated.length < fullCatalog.length);
        return updated;
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const { processedHtml, tocItems } = useMemo(() => {
    if (!activePost) return { processedHtml: '', tocItems: [] };
    const rawHtml = getPostContentHtml(activePost);
    return processArticleToc(rawHtml);
  }, [activePost]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    fullCatalog.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [fullCatalog]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: fullCatalog.length };
    categoriesList.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = fullCatalog.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [fullCatalog, categoriesList]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    fullCatalog.forEach((post) => {
      post.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [fullCatalog]);

  useEffect(() => {
    const checkHashForPost = () => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const slug = hash.replace(/^#\/?(blog\/)?/, '');
        if (slug) {
          const matchedPost = fullCatalog.find((p) => p.slug === slug || p.id === slug);
          if (matchedPost) {
            setActivePost(matchedPost);
          }
        }
      }
    };

    checkHashForPost();
    window.addEventListener('hashchange', checkHashForPost);
    return () => window.removeEventListener('hashchange', checkHashForPost);
  }, [fullCatalog]);

  const handleOpenPost = (post: BlogPost) => {
    setActivePost(post);
    window.location.hash = `#${post.slug}`;
    trackBlogPostView(
      {
        id: post.id,
        slug: post.slug,
        title: post.title,
        category: post.category,
        tags: post.tags,
      },
      langKey
    );
  };

  const handleClosePost = () => {
    setActivePost(null);
    if (typeof window !== 'undefined') {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        window.location.hash = '';
      }
    }
  };

  const isFiltering = selectedCategory !== 'all' || selectedTag !== 'all' || Boolean(searchQuery.trim());

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const sourcePosts = isFiltering ? fullCatalog : displayedPosts;

    return sourcePosts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesTag && matchesQuery;
    });
  }, [isFiltering, fullCatalog, displayedPosts, searchQuery, selectedCategory, selectedTag]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('all');
  };

  const currentCategoryDef = useMemo(() => {
    const found = categoriesList.find((c) => c.id === selectedCategory);
    if (found) return found;
    return categoriesList[0] || {
      id: 'all',
      dayCode: 'ALL',
      scheduleDay: { vi: 'T2 - T6', en: 'Mon - Fri' },
      scheduleFull: { vi: 'Thứ 2 – Thứ 6', en: 'Mon - Fri' },
      title: { vi: 'Tất cả chuyên đề', en: 'All Topics' },
      description: { vi: '', en: '' },
      iconName: 'BookOpenIcon',
    };
  }, [categoriesList, selectedCategory]);

  return (
    <div className="w-full min-h-screen bg-gray-50 relative pt-20">
      {/* Mobile Top Filter Bar */}
      <div className="lg:hidden sticky top-[72px] z-30 px-4 py-2.5 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between shadow-xs">
        <Button
          color="light"
          size="xs"
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-expanded={isMobileSidebarOpen}
        >
          <span className="flex items-center gap-2">
            <FilterIcon size={14} />
            <span>{t.categoriesTitle || 'Chuyên đề'}</span>
            <Badge color="info" size="xs">
              {filteredPosts.length}
            </Badge>
          </span>
        </Button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:block w-72 p-6 border-e border-gray-200 flex-shrink-0">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <CalendarIcon size={15} />
              <span>{t.categoriesTitle || 'Chuyên đề'}</span>
            </div>
            <div className="flex flex-col gap-1">
              {categoriesList.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-sm cursor-pointer border ${
                      isActive
                        ? 'bg-red-50 text-red-600 border-red-200 font-semibold'
                        : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      trackBlogCategoryFilter(cat.id);
                    }}
                  >
                    <div className="flex items-center min-w-0 pr-2">
                      <span className="mr-2 text-red-600 flex-shrink-0">
                        {renderCategoryIcon(cat.iconName, 15)}
                      </span>
                      <span className="truncate">{cat.title[langKey]}</span>
                    </div>
                    <Badge color={isActive ? 'failure' : 'gray'} size="xs">
                      {count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <TagIcon size={15} />
              <span>{t.tagsTitle || 'Thẻ công nghệ'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge
                color={selectedTag === 'all' ? 'failure' : 'gray'}
                size="xs"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setSelectedTag('all');
                  trackBlogTagClick('all');
                }}
              >
                <span>{t.allTopics || 'Tất cả'}</span>
                <span className="ml-1 opacity-75">({fullCatalog.length})</span>
              </Badge>
              {allTags.map((tag) => {
                const isTagActive = selectedTag === tag;
                const count = tagCounts[tag] || 0;
                return (
                  <Badge
                    key={tag}
                    color={isTagActive ? 'failure' : 'gray'}
                    size="xs"
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setSelectedTag(isTagActive ? 'all' : tag);
                      trackBlogTagClick(tag);
                    }}
                  >
                    <span>#{tag}</span>
                    <span className="ml-1 opacity-75">({count})</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Mobile Left Drawer */}
        <Drawer
          open={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          position="left"
          className="w-72 p-0 lg:hidden"
        >
          <DrawerHeader title={t.categoriesTitle || 'Chuyên đề'} className="p-4 border-b border-gray-200" />
          <DrawerItems className="p-4 flex flex-col gap-6 overflow-y-auto">
            <div>
              <div className="flex flex-col gap-1">
                {categoriesList.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-sm cursor-pointer border ${
                        isActive
                          ? 'bg-red-50 text-red-600 border-red-200 font-semibold'
                          : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsMobileSidebarOpen(false);
                      }}
                    >
                      <div className="flex items-center min-w-0 pr-2">
                        <span className="mr-2 text-red-600 flex-shrink-0">
                          {renderCategoryIcon(cat.iconName, 15)}
                        </span>
                        <span className="truncate">{cat.title[langKey]}</span>
                      </div>
                      <Badge color={isActive ? 'failure' : 'gray'} size="xs">
                        {count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <TagIcon size={15} />
                <span>{t.tagsTitle || 'Thẻ công nghệ'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  color={selectedTag === 'all' ? 'failure' : 'gray'}
                  size="xs"
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSelectedTag('all');
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  <span>{t.allTopics || 'Tất cả'}</span>
                  <span className="ml-1 opacity-75">({fullCatalog.length})</span>
                </Badge>
                {allTags.map((tag) => {
                  const isTagActive = selectedTag === tag;
                  const count = tagCounts[tag] || 0;
                  return (
                    <Badge
                      key={tag}
                      color={isTagActive ? 'failure' : 'gray'}
                      size="xs"
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setSelectedTag(isTagActive ? 'all' : tag);
                        setIsMobileSidebarOpen(false);
                      }}
                    >
                      <span>#{tag}</span>
                      <span className="ml-1 opacity-75">({count})</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
          </DrawerItems>
        </Drawer>

        {/* Right Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                {t.title}
              </h1>
              {t.subtitle && (
                <p className="text-base text-gray-600">
                  {t.subtitle}
                </p>
              )}
            </div>

            {/* Sticky Search & Filter Bar */}
            <div className="sticky top-0 z-20 mb-8 p-4 bg-white/95 backdrop-blur-md rounded-lg border border-gray-200 shadow-xs">
              <TextInput
                type="text"
                placeholder={t.searchPlaceholder || 'Tìm kiếm bài viết...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim().length > 2) {
                    trackBlogSearch(e.target.value, filteredPosts.length);
                  }
                }}
                icon={() => <SearchIcon size={18} className="text-gray-400" />}
                sizing="md"
              />

              {isFiltering && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500 uppercase tracking-wider text-xs mr-1">
                    <FilterIcon size={13} className="text-red-600" /> {t.activeFilters || 'Đang lọc:'}
                  </span>

                  {selectedCategory !== 'all' && (
                    <Badge color="failure" size="xs" className="inline-flex items-center gap-1">
                      <span>{t.filterByCategory || 'Chuyên đề'}: <strong>{currentCategoryDef.title[langKey]}</strong></span>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className="ml-1 hover:text-red-900 cursor-pointer"
                      >
                        <CloseIcon size={12} />
                      </button>
                    </Badge>
                  )}

                  {selectedTag !== 'all' && (
                    <Badge color="failure" size="xs" className="inline-flex items-center gap-1">
                      <span>{t.filterByTag || 'Thẻ'}: <strong>#{selectedTag}</strong></span>
                      <button
                        type="button"
                        onClick={() => setSelectedTag('all')}
                        className="ml-1 hover:text-red-900 cursor-pointer"
                      >
                        <CloseIcon size={12} />
                      </button>
                    </Badge>
                  )}

                  {searchQuery.trim() && (
                    <Badge color="failure" size="xs" className="inline-flex items-center gap-1">
                      <span>Search: <strong>"{searchQuery}"</strong></span>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-red-900 cursor-pointer"
                      >
                        <CloseIcon size={12} />
                      </button>
                    </Badge>
                  )}

                  <Button
                    color="light"
                    size="xs"
                    onClick={handleResetFilters}
                    className="ml-auto text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    {t.resetFilters || 'Xóa bộ lọc'}
                  </Button>
                </div>
              )}
            </div>

            {/* Articles Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => {
                  const postCatDef = categoriesList.find((c) => c.id === post.category);
                  const dayColor = postCatDef ? getDayColor(postCatDef.dayCode) : 'gray';

                  return (
                    <Card
                      key={post.slug || post.id}
                      className="p-6 cursor-pointer hover:shadow-md transition-shadow flex flex-col h-full"
                      onClick={() => handleOpenPost(post)}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          {postCatDef && postCatDef.id !== 'all' ? (
                            <Badge color={dayColor} size="xs">
                              {postCatDef.title[langKey]}
                            </Badge>
                          ) : (
                            <Badge color="purple" size="xs">
                              {langKey === 'vi' ? 'Bài viết' : 'Article'}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 font-medium">
                            {post.publishedAt}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 font-medium mb-1.5">
                          {post.readTime}
                        </p>

                        <h2 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 hover:text-red-600 transition-colors mb-2">
                          {post.title}
                        </h2>

                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                          {post.summary}
                        </p>

                        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              color={selectedTag === tag ? 'failure' : 'gray'}
                              size="xs"
                              className="cursor-pointer hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(tag);
                              }}
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="col-span-full py-12 px-6 text-center bg-white border border-gray-200 rounded-lg">
                <div className="flex flex-col items-center">
                  <BookOpenIcon size={40} className="text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t.noArticlesFound}</h3>
                  <Button color="light" size="sm" onClick={handleResetFilters} className="mt-3">
                    {t.resetFilters || 'Xóa bộ lọc'}
                  </Button>
                </div>
              </Card>
            )}

            {/* Load More Button */}
            {!isFiltering && hasMoreMonths && filteredPosts.length > 0 && (
              <div className="flex justify-center mt-10 mb-6">
                <Button
                  color="light"
                  size="md"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="min-w-[180px]"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span>{t.loadingMore || 'Đang tải dữ liệu...'}</span>
                    </span>
                  ) : (
                    <span>{t.loadMoreArticles || 'Tải thêm bài viết'}</span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Blog Article Modal */}
      <BlogModal
        post={activePost}
        isOpen={Boolean(activePost)}
        onClose={handleClosePost}
        processedHtml={processedHtml}
        tocItems={tocItems}
        tCommon={tCommon}
      />
    </div>
  );
};

export default Blog;
