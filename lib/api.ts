import axios from 'axios';
import { type Note } from '../types/note';
import { type NoteTag } from '../types/note';

interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}
export type CreateNoteData = {
  title: string;
  content: string;
  tag: NoteTag;
};

const NEXT_PUBLIC_NOTEHUB_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search,
      tag: tag,
    },
  });
  return data;
};
export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
export const getNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};