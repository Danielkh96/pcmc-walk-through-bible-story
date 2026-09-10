import { notFound } from "next/navigation";
import BookFrontmatter from "../../book-frontmatter";
import { comicChapters } from "../../book-data";
export default async function ChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  if (!comicChapters.some((chapter) => chapter.id === chapterId)) notFound();
  return <BookFrontmatter section="characters" chapterId={chapterId} />;
}
