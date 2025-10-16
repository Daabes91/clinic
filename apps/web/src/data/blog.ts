import type { Locale } from "@/i18n/config";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  content: string;
};

export const blogPosts: Record<Locale, BlogPost[]> = {
  en: [
    {
      slug: "post-whitening-care",
      title: "5 tips to keep your smile bright after whitening",
      excerpt:
        "Follow these dentist-approved steps to extend your whitening results and keep teeth healthy.",
      publishedAt: "2024-04-10",
      content:
        "Whitening provides an instant confidence boost, but aftercare matters. Switch to a low-abrasion toothpaste, avoid staining foods in the first 48 hours, and schedule follow-up cleanings every six months to maintain results."
    },
    {
      slug: "aligners-first-week",
      title: "What to expect in your first week with aligners",
      excerpt:
        "Ease into your treatment with these comfort hacks curated by our orthodontists.",
      publishedAt: "2024-03-27",
      content:
        "The first week introduces gentle pressure as your teeth begin to move. Wear aligners for 22 hours per day, use the provided case to avoid losing trays, and sip cold water to soothe any sensitivity."
    }
  ],
  ar: [
    {
      slug: "post-whitening-care",
      title: "٥ نصائح للحفاظ على ابتسامة مشرقة بعد التبييض",
      excerpt: "اتبع هذه التوجيهات من أطبائنا لإطالة نتائج التبييض والحفاظ على صحة الأسنان.",
      publishedAt: "2024-04-10",
      content:
        "يوفر التبييض نتيجة فورية تمنحك ثقة أكبر، لكن العناية اللاحقة ضرورية. استخدم معجون أسنان لطيفاً، وتجنب الأطعمة المسببة للتصبغ خلال أول ٤٨ ساعة، واحجز جلسة تنظيف كل ستة أشهر للحفاظ على النتائج."
    },
    {
      slug: "aligners-first-week",
      title: "ماذا تتوقع في أسبوعك الأول مع التقويم الشفاف",
      excerpt: "نصائح مريحة من فريق التقويم لدينا تساعدك على التكيف بسرعة.",
      publishedAt: "2024-03-27",
      content:
        "قد تشعر ببعض الضغط الخفيف بينما تبدأ أسنانك بالتحرك. احرص على ارتداء التقويم لمدة ٢٢ ساعة يومياً، واستخدم العلبة المرفقة لحفظ القوالب، واشرب الماء البارد لتخفيف أي حساسية."
    }
  ]
};

export function findBlogPost(locale: Locale, slug: string) {
  return blogPosts[locale].find((post) => post.slug === slug);
}
