'use client';

import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { authenticated, loading } = useAuthContext();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      if (!searchParams) {
        return ''; // Handle the case when searchParams is null
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      const { method } = CONFIG.auth;

      const signInPath = {
        jwt: paths.auth.jwt.signIn,
        auth0: paths.auth.auth0.signIn,
        amplify: paths.auth.amplify.signIn,
        firebase: paths.auth.firebase.signIn,
        supabase: paths.auth.supabase.signIn,
      }[method];

      const href = `${signInPath}?${createQueryString('returnTo', pathname || '/')}`; // Use a fallback for pathname

      router.replace(href);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
