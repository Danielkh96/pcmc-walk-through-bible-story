import { notFound } from "next/navigation";
import ComicReader from "../comic-reader";
import { comicChapters } from "../book-data";
export default async function ReadPage({ searchParams }: { searchParams: Promise<{ chapter?: string; page?: string }> }) {
  const { chapter: id = comicChapters[0].id, page } = await searchParams;
  const chapter = comicChapters.find((item) => item.id === id);
  if (!chapter) notFound();
  return <ComicReader chapter={chapter} initialPage={page} />;
}
