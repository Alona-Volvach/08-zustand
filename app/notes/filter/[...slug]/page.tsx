import css from "./Notes.module.css";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { NoteTag } from "@/types/note";

type Props = {
  params: { slug: string[] };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const tag = params.slug?.[0] || "all";

  return {
    title: `Notes - ${tag}`,
    description: `Viewing notes filtered by ${tag}`,
    openGraph: {
      title: `Notes - ${tag}`,
      description: `Viewing notes filtered by ${tag}`,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const queryClient = new QueryClient();

  const tag: NoteTag | undefined =
    params.slug?.[0] !== "all"
      ? (params.slug?.[0] as NoteTag)
      : undefined;

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, tag],
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