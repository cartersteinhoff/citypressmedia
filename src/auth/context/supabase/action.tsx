'use client';

import type {
  AuthError,
  AuthResponse,
  UserResponse,
  AuthTokenResponsePassword,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/supabase-js';

import { paths } from 'src/routes/paths';

import { supabase } from 'src/lib/supabase';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
  options?: SignInWithPasswordCredentials['options'];
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  options?: SignUpWithPasswordCredentials['options'];
};

export type ResetPasswordParams = {
  email: string;
  options?: {
    redirectTo?: string;
    captchaToken?: string;
  };
};

export type UpdatePasswordParams = {
  password: string;
  options?: {
    emailRedirectTo?: string | undefined;
  };
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({
  email,
  password,
}: SignInParams): Promise<AuthTokenResponsePassword> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  // Handle error case
  if (error) {
    console.error(error);
    return {
      data: {
        user: null,
        session: null,
        weakPassword: null, // Explicitly setting weakPassword to null in case of error
      },
      error,
    };
  }

  // Handle success case
  return {
    data: {
      user: data.user,
      session: data.session,
      weakPassword: data.weakPassword,
    },
    error: null,
  };
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}${paths.dashboard.root}`,
      data: { display_name: `${firstName} ${lastName}` },
    },
  });

  // Handle error case
  if (error) {
    console.error(error);
    return {
      data: {
        user: null,
        session: null,
      },
      error,
    };
  }

  if (!data?.user?.identities?.length) {
    throw new Error('This user already exists');
  }

  // Handle success case
  return {
    data: {
      user: data.user,
      session: data.session,
    },
    error: null,
  };
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return { error };
  }

  return { error: null };
};

/** **************************************
 * Reset password
 *************************************** */
export const resetPassword = async ({
  email,
}: ResetPasswordParams): Promise<{ data: {}; error: null } | { data: null; error: AuthError }> => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${paths.auth.supabase.updatePassword}`,
  });

  // Handle error case
  if (error) {
    console.error(error);
    return {
      data: null,
      error,
    };
  }

  // Handle success case
  return {
    data: {},
    error: null,
  };
};

/** **************************************
 * Update password
 *************************************** */
export const updatePassword = async ({ password }: UpdatePasswordParams): Promise<UserResponse> => {
  const { data, error } = await supabase.auth.updateUser({ password });

  // Handle error case
  if (error) {
    console.error(error);
    return {
      data: {
        user: null,
      },
      error,
    };
  }

  // Handle success case
  return {
    data: {
      user: data.user,
    },
    error: null,
  };
};
