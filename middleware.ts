import {NextResponse, type NextRequest} from 'next/server';
import {createServerClient} from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale, pathnames, localePrefix} from './lib/navigation';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  pathnames,
  localePrefix
});

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Admin auth guard
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    let response = NextResponse.next({request});
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value));
          response = NextResponse.next({request});
          cookiesToSet.forEach(({name, value, options}) => response.cookies.set(name, value, options));
        }
      }
    });

    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/admin/login', request.url));
    return response;
  }

  // Locale routing for all other paths
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/',
    '/(en|ru|tr|ar|az)/:path*',
    '/((?!_next|_vercel|api|.*\\..*).*)'
  ]
};
