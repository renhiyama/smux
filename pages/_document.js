import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href="/build.css"></link>
      </Head>
      <body className="min-h-screen bg-slate-900 no-scrollbar overflow-y-hidden">
        <Main />
        <NextScript />
        <Script src="/helper.js" strategy="afterInteractive" />
      </body>
    </Html>
  );
}
