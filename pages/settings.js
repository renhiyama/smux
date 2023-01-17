import Navbar from "./components/navbar";
import Area from "./components/area";
import Loader from "./components/loader";
import { useEffect } from "react";
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>Smux Editor</Head>

      <Navbar />
      <Area page="settings"></Area>
    </>
  );
}
