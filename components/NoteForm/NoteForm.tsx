'use client';
import css from './NoteForm.module.css';

import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api';
import { type NoteTag } from '../../types/note';
import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore';

type NoteFormValues = {
  title: string;
  content: string;
  tag: NoteTag;
};

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const router = useRouter();
  const baseId = useId();
  const queryClient = useQueryClient();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setDraft({
      ...draft,
      [name]: value,
    });
  };

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  const handleSubmit = (formData: FormData) => {
    const values = Object.fromEntries(formData) as NoteFormValues;
    mutation.mutate(values);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${baseId}-title`}>Title</label>

        <input
          id={`${baseId}-title`}
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${baseId}-content`}>Content</label>

        <textarea
          id={`${baseId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${baseId}-tag`}>Tag</label>

        <select
          id={`${baseId}-tag`}
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}