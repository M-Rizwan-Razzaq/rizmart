"use client";

import NextLink from "next/link";
import {
  useRouter as useNextRouter,
  usePathname,
  useParams as useNextParams,
} from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

/**
 * Thin react-router-dom compatibility layer built on top of Next.js App Router.
 * Exposes the same API surface the app used (Link, NavLink, Navigate,
 * useNavigate, useLocation, useParams, useSearchParams) so existing components
 * keep working unchanged. Location state is bridged through sessionStorage.
 */

const NAV_STATE_PREFIX = "__luxora_nav_state:";

function toPathname(to: string): string {
  return to.split("?")[0].split("#")[0];
}

function getSearch(): string {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

function readNavState(pathname: string): unknown {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(NAV_STATE_PREFIX + pathname);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeNavState(pathname: string, state: unknown) {
  if (typeof window === "undefined") return;
  try {
    if (state == null) window.sessionStorage.removeItem(NAV_STATE_PREFIX + pathname);
    else window.sessionStorage.setItem(NAV_STATE_PREFIX + pathname, JSON.stringify(state));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

function clearNavStates() {
  if (typeof window === "undefined") return;
  try {
    const keys = Object.keys(window.sessionStorage).filter((k) => k.startsWith(NAV_STATE_PREFIX));
    keys.forEach((k) => window.sessionStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export type LocationLike = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
};

export function useLocation(): LocationLike {
  const pathname = usePathname();
  const [search, setSearch] = useState<string>(() => getSearch());
  const [state, setState] = useState<unknown>(() => readNavState(pathname));

  useEffect(() => {
    setSearch(getSearch());
    setState(readNavState(pathname));
  }, [pathname]);

  useEffect(() => {
    const onPop = () => setSearch(getSearch());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return { pathname, search, hash: "", state, key: pathname };
}

export function useParams<Params = Record<string, string | undefined>>(): Params {
  return useNextParams() as Params;
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams) => void] {
  const location = useLocation();
  const router = useNextRouter();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const setParams = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.replace(`${location.pathname}${qs ? `?${qs}` : ""}`);
    },
    [router, location.pathname],
  );

  return [params, setParams];
}

export type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

export function useNavigate() {
  const router = useNextRouter();

  return useCallback(
    (to: string, options?: NavigateOptions) => {
      clearNavStates();
      if (options?.state != null) writeNavState(toPathname(to), options.state);
      if (options?.replace) router.replace(to);
      else router.push(to);
    },
    [router],
  );
}

export function Navigate({
  to,
  replace = false,
  state,
}: {
  to: string;
  replace?: boolean;
  state?: unknown;
}) {
  const router = useNextRouter();

  useEffect(() => {
    if (state != null) writeNavState(toPathname(to), state);
    if (replace) router.replace(to);
    else router.push(to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  replace?: boolean;
  state?: unknown;
  children?: ReactNode;
};

export function Link({ to, replace, state, children, onClick, ...rest }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (state != null) writeNavState(toPathname(to), state);
    onClick?.(e);
  };

  return (
    <NextLink href={to} replace={replace} onClick={handleClick} {...rest}>
      {children}
    </NextLink>
  );
}

type NavLinkRenderProps = { isActive: boolean };

type NavLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
> & {
  to: string;
  children?: ReactNode | ((props: NavLinkRenderProps) => ReactNode);
  className?: string | ((props: NavLinkRenderProps) => string | undefined);
  end?: boolean;
};

export function NavLink({ to, className, children, end, ...rest }: NavLinkProps) {
  const location = useLocation();
  const [path] = to.split("?");
  const isActive = end
    ? location.pathname === path
    : location.pathname.startsWith(path) && path !== "/";

  const cls = typeof className === "function" ? className({ isActive }) : className;
  const kids = typeof children === "function" ? children({ isActive }) : children;

  return (
    <NextLink href={to} className={cls} {...rest}>
      {kids}
    </NextLink>
  );
}

export { useNextRouter as useRouter };
