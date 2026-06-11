import css from "./NotesPage.module.css"
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { NoteTag } from '@/types/note';
type Props = {
  params: { slug: string[] };
};
type GenerateMetadataProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Note: ${slug.join('/')}`,
    description: `Note by: ${slug.join('/')}`,
    openGraph: {
      title: `Note: ${slug.join('/')}`,
      description: `Note by: ${slug.join('/')}`,
      url: `/notes/filter/${slug.join('/')}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
      type: 'article',
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const queryClient = new QueryClient();

  const { slug } = await params;

  const tag: NoteTag | undefined =
    slug?.[0] && slug?.[0] !== 'all' ? (slug?.[0] as NoteTag) : undefined;

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: undefined,
        perPage: 12,
        tag: tag,
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