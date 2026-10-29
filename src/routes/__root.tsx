import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import {
  GA_MEASUREMENT_ID,
  META_PIXEL_ID,
  metaPixelBootstrapScript,
  metaPixelNoscriptSrc,
  trackPageView,
} from "../lib/analytics";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { inlineJson, organizationJsonLd, plainMeta, websiteJsonLd } from "../lib/seo";
import { BRAND } from "../lib/site";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: plainMeta(BRAND.legalName) },
      { name: "description", content: plainMeta(BRAND.description) },
      { name: "theme-color", content: "#0A0A0A" },
      { name: "application-name", content: BRAND.shortName },
      { name: "apple-mobile-web-app-title", content: BRAND.shortName },
      { name: "msapplication-TileColor", content: "#0A0A0A" },
      { name: "msapplication-TileImage", content: "/mstile-150x150.png" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: plainMeta(BRAND.legalName) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: inlineJson(organizationJsonLd()),
      },
      {
        type: "application/ld+json",
        children: inlineJson(websiteJsonLd()),
      },
      {
        children: metaPixelBootstrapScript(META_PIXEL_ID),
      },
      ...(GA_MEASUREMENT_ID
        ? [
            {
              src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
              async: true,
            },
            {
              children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`,
            },
          ]
        : []),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const noscriptSrc = metaPixelNoscriptSrc(META_PIXEL_ID);
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {noscriptSrc ? (
          <noscript>
            <img height={1} width={1} style={{ display: "none" }} src={noscriptSrc} alt="" />
          </noscript>
        ) : null}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function MetaPixelPageViews() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    trackPageView();
  }, [pathname]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MetaPixelPageViews />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
