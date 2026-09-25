/**
 * Google Analytics 4 (GA4) & Google Tag Manager (GTM) Analytics Engine
 * Provides dual-dispatch to window.dataLayer (GTM) and window.gtag (GA4)
 * with full TypeScript type-safety, multi-language tracking (vi/en), and development logs.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'development';

export interface BaseEventParams {
  [key: string]: string | number | boolean | undefined | null | string[];
}

/**
 * Resolves the currently active language ('vi' | 'en') from pathname, HTML lang, or storage.
 */
export function getCurrentLanguage(): 'vi' | 'en' {
  if (typeof window === 'undefined') return 'vi';
  if (window.location.pathname.startsWith('/en')) return 'en';
  if (window.location.pathname.startsWith('/vi')) return 'vi';
  const htmlLang = document.documentElement.getAttribute('lang');
  if (htmlLang === 'en' || htmlLang === 'vi') return htmlLang;
  try {
    const saved = localStorage.getItem('app-lang');
    if (saved === 'en' || saved === 'vi') return saved;
  } catch {
    // ignore
  }
  return 'vi';
}

/**
 * Core event dispatcher that sends telemetry to both GTM dataLayer and GA4 gtag.
 */
export function trackEvent(eventName: string, params: BaseEventParams = {}): void {
  if (typeof window === 'undefined') return;

  const currentLang = (params.language as 'vi' | 'en') || getCurrentLanguage();

  const eventPayload = {
    event: eventName,
    app_env: APP_ENV,
    language: currentLang,
    content_language: currentLang,
    timestamp: new Date().toISOString(),
    ...params,
  };

  // 1. Push to Google Tag Manager dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  // 2. Direct GA4 gtag event dispatch (if gtag initialized)
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...params,
      language: currentLang,
      content_language: currentLang,
    });
  }

  // 3. Verbose debug logging during development
  if (process.env.NODE_ENV === 'development' || APP_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug(`[Analytics Engine] 📊 Event: "${eventName}" [${currentLang}]`, eventPayload);
  }
}

/* ==========================================================================
   Typed High-Level Telemetry Event Handlers
   ========================================================================== */

/**
 * Tracks virtual pageviews on route/hash changes with language dimension.
 */
export function trackPageView(
  pagePath: string,
  pageTitle: string,
  language?: 'vi' | 'en'
): void {
  const currentLang = language || getCurrentLanguage();

  // Set user property in GA4 for language segmentation
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', {
      preferred_language: currentLang,
    });
  }

  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    language: currentLang,
    content_language: currentLang,
  });
}

/**
 * Tracks multi-language localization switches (vi <-> en).
 */
export function trackLanguageChange(newLang: 'vi' | 'en', fromLang?: 'vi' | 'en'): void {
  trackEvent('language_change', {
    selected_language: newLang,
    previous_language: fromLang,
    language: newLang,
    content_language: newLang,
  });
}

/**
 * Tracks Dark Mode / Light Mode theme toggles.
 */
export function trackThemeChange(theme: 'dark' | 'light'): void {
  trackEvent('theme_toggle', {
    selected_theme: theme,
  });
}

/**
 * Tracks user navigation clicks (header nav, drawer menu, footer).
 */
export function trackNavigation(
  navItem: string,
  navTarget: string,
  source: 'desktop_header' | 'mobile_drawer' | 'footer' | 'hero_cta' = 'desktop_header'
): void {
  trackEvent('navigation_click', {
    nav_item: navItem,
    nav_target: navTarget,
    nav_source: source,
  });
}

/**
 * Tracks opening and reading a technical blog post.
 */
export function trackBlogPostView(
  post: {
    id?: string | number;
    slug: string;
    title: string;
    category?: string;
    tags?: string[];
  },
  language?: 'vi' | 'en'
): void {
  const currentLang = language || getCurrentLanguage();
  trackEvent('blog_post_view', {
    post_id: String(post.id || post.slug),
    post_slug: post.slug,
    post_title: post.title,
    post_category: post.category || 'general',
    post_tags: (post.tags || []).join(', '),
    language: currentLang,
    content_language: currentLang,
  });
}

/**
 * Tracks blog keyword search queries and number of results matched.
 */
export function trackBlogSearch(searchQuery: string, resultCount: number): void {
  if (!searchQuery.trim()) return;
  trackEvent('blog_search', {
    search_term: searchQuery.trim(),
    results_count: resultCount,
  });
}

/**
 * Tracks blog category filter selection.
 */
export function trackBlogCategoryFilter(categoryKey: string): void {
  trackEvent('blog_category_filter', {
    selected_category: categoryKey,
  });
}

/**
 * Tracks blog tag chip click.
 */
export function trackBlogTagClick(tag: string): void {
  trackEvent('blog_tag_click', {
    selected_tag: tag,
  });
}

/**
 * Tracks case study modal interactions.
 */
export function trackProjectModalOpen(project: {
  id: string;
  title: string;
  category?: string;
}): void {
  trackEvent('project_case_study_open', {
    project_id: project.id,
    project_title: project.title,
    project_category: project.category || 'engineering',
  });
}

/**
 * Tracks outbound external project links (Live Demo, GitHub repository).
 */
export function trackProjectLinkClick(
  projectTitle: string,
  url: string,
  linkType: 'live_demo' | 'github_repo' | 'case_study' | 'external_doc'
): void {
  trackEvent('project_link_click', {
    project_title: projectTitle,
    target_url: url,
    link_type: linkType,
  });
}

/**
 * Tracks CV printing and PDF export actions.
 */
export function trackPrintCV(action: 'trigger_print' | 'export_pdf' | 'view_print_mode'): void {
  trackEvent('cv_print_action', {
    print_action: action,
  });
}

/**
 * Tracks anti-scraping obfuscated contact reveals.
 */
export function trackContactReveal(channel: 'email' | 'phone' | 'telegram'): void {
  trackEvent('contact_reveal', {
    contact_channel: channel,
  });
}

/**
 * Tracks copying contact info to clipboard.
 */
export function trackContactCopy(channel: 'email' | 'phone' | 'telegram'): void {
  trackEvent('contact_copy', {
    contact_channel: channel,
  });
}

/**
 * Tracks social media / profile outbound clicks.
 */
export function trackSocialClick(platform: string, targetUrl: string): void {
  trackEvent('social_link_click', {
    social_platform: platform,
    target_url: targetUrl,
  });
}

/**
 * Tracks Table of Contents heading clicks in article modal.
 */
export function trackTocHeadingClick(
  articleSlug: string,
  headingId: string,
  headingText: string
): void {
  trackEvent('article_toc_click', {
    article_slug: articleSlug,
    heading_id: headingId,
    heading_text: headingText,
  });
}

/**
 * Tracks floating scroll-to-top button trigger.
 */
export function trackScrollToTop(): void {
  trackEvent('scroll_to_top_click');
}
