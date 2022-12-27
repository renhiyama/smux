import Script from "next/script";
import Head from "next/head";
import Navbar from "./components/navbar";
import Area from "./components/area";
import Loader from "./components/loader";
export default function Workspace(){
  return(
    <>
    <Head>
        <title>Smux</title>
      </Head>
      <Loader />
      <Navbar />
      <Area page="workspace">
        <h1 className="text-white">Hello World</h1>
      </Area>
    </>
  )
}