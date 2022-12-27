import Head from "next/head";
import Navbar from "./components/navbar";
import Area from "./components/area";
import Loader from "./components/loader";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    Toast("Hey there!", "success", "hello world");
  });
  return (
    <>
      <Head>
        <title>EditerMX</title>
      </Head>
      <Loader />
      <Navbar />
      <Area page="files">
      </Area>
    </>
  )
}