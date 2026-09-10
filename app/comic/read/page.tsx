import { notFound } from "next/navigation";
import ComicReader from "../comic-reader";
import { comicChapters } from "../book-data";
export default async function ReadPage({ searchParams }: { searchParams: Promise<{ chapter?: string }> }) {
  const { chapter: id = comicChapters[0].id } = await searchParams;
  const chapter = comicChapters.find((item) => item.id === id);
  if (!chapter) notFound();
  return <ComicReader chapter={chapter} />;
}
