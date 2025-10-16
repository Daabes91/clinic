import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@clinic/ui-kit";
import { blogPosts, findBlogPost } from "@/data/blog";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

type PageParams = { locale: string; slug: string };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    blogPosts[locale as Locale].map((post) => ({
      locale,
      slug: post.slug
    }))
  );
}

export async function generateMetadata({
  params
}: {
  params: PageParams;
}): Promise<Metadata> {
  if (!isLocale(params.locale)) {
    return {};
  }

  const post = findBlogPost(params.locale, params.slug);
  if (!post) {
    return {};
  }

  return {
    title: `${post.title} — Clinic Blog`,
    description: post.excerpt
  };
}

export default function BlogArticlePage({ params }: { params: PageParams }) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;
  const post = findBlogPost(locale, params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white py-12">
      <Container className="mx-auto max-w-3xl space-y-8">
        <Link
          href={`/${locale}/blog`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-500"
        >
          ← Back to articles
        </Link>
        <article className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-blue-600">
              {new Date(post.publishedAt).toLocaleDateString(locale, {
                day: "2-digit",
                month: "long",
                year: "numeric"
              })}
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">{post.title}</h1>
          </div>
          <p className="text-base leading-relaxed text-slate-700">{post.content}</p>
        </article>
      </Container>
    </div>
  );
}
