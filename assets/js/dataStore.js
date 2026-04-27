import { supabase } from './supabaseClient.js';

export async function getLessons() {
  const { data, error } = await supabase
    .from('curriculum_lessons')
    .select('*')
    .eq('is_active', true)
    .order('week', { ascending: true })
    .order('day', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getLessonProgress(userId) {
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id,status,completed_at')
    .eq('user_id', userId);

  return data ?? [];
}

export async function upsertLessonProgress(userId, lessonId, status) {
  const completedAt = status === 'completed' ? new Date().toISOString() : null;
  const payload = {
    user_id: userId,
    lesson_id: lessonId,
    status,
    completed_at: completedAt
  };

  const { error } = await supabase.from('lesson_progress').upsert(payload, {
    onConflict: 'user_id,lesson_id'
  });

  return { error };
}

export async function getReflection(userId, lessonId) {
  const { data } = await supabase
    .from('lesson_reflections')
    .select('reflection_text')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  return data?.reflection_text ?? '';
}

export async function upsertReflection(userId, lessonId, text) {
  const { error } = await supabase.from('lesson_reflections').upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      reflection_text: text,
      output_excerpt: ''
    },
    { onConflict: 'user_id,lesson_id' }
  );

  return { error };
}