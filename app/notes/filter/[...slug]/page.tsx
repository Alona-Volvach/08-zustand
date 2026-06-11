import css from "./NotesPage.module.css";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { NoteTag } from "@/types/note";

type Params = {
  slug: string[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;

  const tag = slug?.[0] || "all";

  return {
    title: `Notes - ${tag}`,
    description: `Viewing notes filtered by ${tag}`,
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const tag: NoteTag | undefined =
    slug?.[0] && slug[0] !== "all"
      ? (slug[0] as NoteTag)
      : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        tag,
      }),
  });

  return (
    <div className={css.app}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={tag} />
      </HydrationBoundary>
    </div>
  );
}