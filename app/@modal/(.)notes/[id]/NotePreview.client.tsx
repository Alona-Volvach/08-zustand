'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';
export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => getNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{data?.title}</h2>
          </div>

          <p className={css.tag}>{data?.tag}</p>
          <p className={css.content}>{data?.content}</p>
          <p className={css.date}>{data?.createdAt}</p>
        </div>
      </div>

      <button onClick={() => router.back()}>Close</button>
    </Modal>
  );
}