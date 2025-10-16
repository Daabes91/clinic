import Link from "next/link";
import { Container, SectionTitle } from "@clinic/ui-kit";
import { blogPosts } from "@/data/blog";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default function BlogIndexPage({
  params
}: {
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }
  const locale = params.locale as Locale;
  const posts = blogPosts[locale];

  return (
    <div className="py-12">
      <Container className="space-y-10">
        <SectionTitle
          eyebrow="Insights"
          title="Latest from our dental experts"
          description="Articles, guides, and clinic updates shared by our doctors."
        />
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group rounded-3xl border border-slate-200 p-6 transition hover:border-blue-200 hover:shadow-lg"
            >
              <p className="text-xs uppercase tracking-widest text-blue-600">
                {new Date(post.publishedAt).toLocaleDateString(locale, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600">
                Read article →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
