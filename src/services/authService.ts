import { getSupabaseClient, isSupabaseConfigured } from '@/utils/supabase/client';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

/**
 * Signs in user directly with Supabase Email & Password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      error:
        'Supabase chưa được cấu hình biến môi trường NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { user: null, error: 'Không thể khởi tạo Supabase client.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (err: any) {
    return {
      user: null,
      error: err.message || 'Đã xảy ra lỗi không xác định khi đăng nhập Supabase.',
    };
  }
}

/**
 * Signs in via Supabase GitHub OAuth
 */
export async function signInWithGitHub(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        'Supabase chưa được cấu hình biến môi trường NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: 'Không thể khởi tạo Supabase client.' };
  }

  try {
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/admin`
        : undefined;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo,
        scopes: 'read:user user:email',
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data?.url && typeof window !== 'undefined') {
      window.location.href = data.url;
    }

    return { error: null };
  } catch (err: any) {
    return {
      error:
        err.message || 'Đã xảy ra lỗi không xác định khi đăng nhập GitHub OAuth.',
    };
  }
}

/**
 * Signs out the currently authenticated user
 */
export async function signOut(): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: null };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to sign out.' };
  }
}

/**
 * Gets the current active session
 */
export async function getSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data) return null;
    return data.session;
  } catch {
    return null;
  }
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Subscribes to auth state changes
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return () => {
    subscription.unsubscribe();
  };
}
