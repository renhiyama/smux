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
      <Area page="index">
        <div className="min-h-screen rounded-l-md p-8">
          <svg viewBox="0 0 455 455" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 lg:w-48 lg:h-48 mx-auto justify-self-auto min-h-screen">
            <path d="M40 81L40 39L202.47 39C216.277 39 227.47 50.1929 227.47 64V71C227.47 76.5228 222.992 81 217.47 81L40 81Z" fill="#0f172a" />
            <path d="M40.1298 39.395L82.1298 39.395L82.1298 216.865C82.1298 222.387 77.6526 226.865 72.1298 226.865H65.1298C51.3226 226.865 40.1298 215.672 40.1298 201.865L40.1298 39.395Z" fill="#0f172a" />
            <path d="M372.34 237C372.34 231.477 376.817 227 382.34 227H389.34C403.147 227 414.34 238.193 414.34 252V414.47H372.34V237Z" fill="#0f172a" />
            <path d="M252 414.865C238.193 414.865 227 403.672 227 389.865V382.865C227 377.342 231.477 372.865 237 372.865L414.47 372.865V414.865L252 414.865Z" fill="#0f172a" />
            <circle cx="182.5" cy="182.5" r="22.5" fill="#0f172a" />
            <circle cx="227.5" cy="227.5" r="22.5" fill="#0f172a" />
            <circle cx="272.5" cy="272.5" r="22.5" fill="#0f172a" />
          </svg>
        </div>
      </Area>
    </>
  )
}