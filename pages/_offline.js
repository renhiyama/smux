import Navbar from "./components/navbar";
import Area from "./components/area";
import Loader from "./components/loader";
import { useEffect } from "react";
import Head from "next/head";
export default function Home() {
  return (
    <>
      <Head>
        Smux Editor
      </Head>
      <Navbar />
      <Area page="offline">
        <div className="flex justify-center items-center h-screen">
          <div className="mx-auto text-center">
            <h1 className="min-h-screen text-center pt-16 text-red-600 font-extrabold text-3xl lg:text-6xl">No Network!</h1>
          </div>
        </div>
      </Area>
    </>
  )
}