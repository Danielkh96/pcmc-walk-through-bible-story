import { notFound, redirect } from "next/navigation";
import { isRetiredCreationChapter } from "../../navigation.mjs";
import BookFrontmatter from "../../book-frontmatter";
import { comicChapters } from "../../book-data";
export default async function ChapterPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  if (isRetiredCreationChapter(chapterId)) redirect("/comic/chapter/creation");
  if (!comicChapters.some((chapter) => chapter.id === chapterId)) notFound();
  return <BookFrontmatter section="characters" chapterId={chapterId} />;
}
