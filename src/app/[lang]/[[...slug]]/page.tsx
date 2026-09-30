import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, Locale } from '../dictionaries';
import { resolveRoute, getStaticRouteParams } from '../router';

interface CatchAllPageProps {
  params: Promise<{
    lang: string;
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  return await getStaticRouteParams();
}

export async function generateMetadata({ params }: CatchAllPageProps): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const route = resolveRoute(slug);
  if (!route) {
    return {};
  }

  return route.generateMetadata(lang as Locale);
}

export default async function DynamicLocalizedPage({ params }: CatchAllPageProps) {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const route = resolveRoute(slug);
  if (!route) {
    notFound();
  }

  const PageComponent = route.component;
  return <PageComponent lang={lang as Locale} />;
}
