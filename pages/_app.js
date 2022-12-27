// pages/_app.js
import Head from 'next/head'
import Loader from './components/loader'
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logos/192x192.png" />
        <meta charSet='utf-8' />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="A Code Editor Optimized for Mobiles with Termux Support" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@rovelstars" />
        <meta name="twitter:creator" content="@rovelstars" />
        <meta name="twitter:title" content="Smux Editor" />
        <meta name="twitter:description" content="A Code Editor Optimized for Mobiles with Termux Support" />
        <meta name="twitter:image" content="https://smux.rovelstars.com/logos/512x512.png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Smux Editor" />
        <meta property="og:description" content="A Code Editor Optimized for Mobiles with Termux Support" />
        <meta property="og:site_name" content="Smux Editor" />
        <meta property="og:url" content="https://smux.rovelstars.com" />
        <meta property="og:image" content="https://smux.rovelstars.com/logos/512x512.png" />
        <meta property="og:image:secure_url" content="https://smux.rovelstars.com/logos/512x512.png" />
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
  )
}

export default MyApp