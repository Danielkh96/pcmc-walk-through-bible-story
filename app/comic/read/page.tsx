import { notFound, redirect } from "next/navigation";
import { isRetiredCreationChapter } from "../navigation.mjs";
import ComicReader from "../comic-reader";
import { comicChapters } from "../book-data";
export default async function ReadPage({ searchParams }: { searchParams: Promise<{ chapter?: string; page?: string }> }) {
  const { chapter: id = comicChapters[0].id, page } = await searchParams;
  if (isRetiredCreationChapter(id)) redirect("/comic/read?chapter=creation&page=1");
  const chapter = comicChapters.find((item) => item.id === id);
  if (!chapter) notFound();
  return <ComicReader chapter={chapter} initialPage={page} />;
}
