'use client';
import css from './NoteDetails.module.css';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getNoteById } from '@/lib/api';

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => getNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
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
  );
}