import Head from "next/head";
import Navbar from "./components/navbar";
import Area from "./components/area";
import Loader from "./components/loader";
import { useEffect } from "react";
import Script from "next/script";

export default function Home() {
  return (
    <>
    <Script src="https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict/ace.min.js" strategy='beforeInteractive'></Script>
    <Head>
      Smux Editor
    </Head>
      <Navbar />
      <Area page="files">
      </Area>
    </>
  )
}