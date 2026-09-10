import type { Metadata } from "next";
import ComicReader from "./comic-reader";
import BookFrontmatter from "./book-frontmatter";

export const metadata: Metadata = {
  title: "圣经漫画故事 | PCMC",
  description: "跟着小昆和小君走进圣经漫画故事。人物介绍、章节目录与逐页漫画。",
  robots: { index: false, follow: false },
};

export default async function ComicPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const query = await searchParams;
  // Keep previously shared /comic?page=N links working.
  return query.page !== undefined ? <ComicReader initialPage={query.page} /> : <BookFrontmatter section="contents" />;
}
