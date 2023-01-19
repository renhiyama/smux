// pages/_app.js
import Head from "next/head";
import { useEffect } from "react";
import Loader from "./components/loader";
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    //if mobilescreen goto fullscreen
    //listen for user touch
    let e = (event) => {
      if (
        Math.min(window.innerWidth, window.innerHeight) < 800 &&
        document.fullscreenElement == null &&
        !localStorage.getItem("disableFullScreen")
      ) {
        try {
          document.documentElement.requestFullscreen();
        } catch (e) {}
      }
    };
    document.documentElement.addEventListener("click", e);
    return () => {
      document.documentElement.removeEventListener("click", e);
    };
  }, []);
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logos/192x192.png" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="A Code Editor Optimized for Mobiles with Termux Support"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@rovelstars" />
        <meta name="twitter:creator" content="@rovelstars" />
        <meta name="twitter:title" content="Smux Editor" />
        <meta
          name="twitter:description"
          content="A Code Editor Optimized for Mobiles with Termux Support"
        />
        <meta
          name="twitter:image"
          content="https://smux.rovelstars.com/logos/512x512.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Smux Editor" />
        <meta
          property="og:description"
          content="A Code Editor Optimized for Mobiles with Termux Support"
        />
        <meta property="og:site_name" content="Smux Editor" />
        <meta property="og:url" content="https://smux.rovelstars.com" />
        <meta
          property="og:image"
          content="https://smux.rovelstars.com/logos/512x512.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://smux.rovelstars.com/logos/512x512.png"
        />
        <meta property="og:image:alt" content="Smux Editor" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="128" />
        <meta property="og:image:height" content="128" />
        <meta property="og:image:alt" content="Smux Editor" />
        <meta property="og:image:type" content="image/png" />
      </Head>
      <Loader />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
