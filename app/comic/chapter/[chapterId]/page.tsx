import { notFound, redirect } from "next/navigation";
import { comicChapterEntry, isRetiredCreationChapter } from "../../navigation.mjs";
import BookFrontmatter from "../../book-frontmatter";
import { comicChapters } from "../../book-data";
export default async function ChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  if (isRetiredCreationChapter(chapterId)) redirect("/comic/chapter/creation");
  const chapter = comicChapters.find((item) => item.id === chapterId);
  if (!chapter) notFound();
  if (chapter.number !== 1 && chapter.newCharacterIds.length === 0) redirect(comicChapterEntry(chapter));
  return <BookFrontmatter section="characters" chapterId={chapterId} />;
}
