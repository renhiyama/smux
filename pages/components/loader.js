import { useEffect } from "react";
import Image from "next/image";
export default function Loader() {
  useEffect(() => {
    (async () => {
      let loader = document.getElementById("loader");
      //check whether service worker feature is available
      if (!("serviceWorker" in navigator)) {
        loader.innerText = "Service worker is not available. Installation cannot proceed.";
        return;
      }
      //check whether service worker is already installed
      if (navigator?.serviceWorker?.controller) {
        //check if service worker is updated
        if ((await navigator.serviceWorker.getRegistration()).waiting) {
          loader.innerText = "Please Close This Tab & Open A New One To Proceed.";
        }
        loader.innerText = "Starting...";
        let loaddiv = document.getElementById("loaddiv");
        loaddiv.classList.remove("opacity-100");
        loaddiv.classList.add("opacity-0");
         setTimeout(() => {
           loaddiv.classList.add("hidden");
       }, 1000);
      }
      else {
        loader.innerText = "Service worker is available. Installing...";
        //register service worker
        navigator?.serviceWorker?.register("/sw.js").then((reg) => {
          loader.innerText = "Activating...";
          //if the service worker is installed, then reload the page
          window.location.reload();
        });
      }
    })();
  })
  return (<div id="loaddiv" className="z-100 h-screen w-screen bg-slate-900 transition-opacity duration-500 opacity-100">
    {/* center logo horizontally and vertically */}
    <div className="flex justify-center items-center h-screen">
      <div className="mx-auto text-center">
        <Image
          src="/logos/transparent.svg" alt="EditerMX Logo" height={200} width={200}
          className="w-24 h-24 lg:w-48 lg:h-48 mx-auto animate-pulse" priority="high"
        />
        <p id="loader" className="font-bold text-gray-300 text-xl pt-8">Loading...</p>
      </div>
    </div>
  </div>)
}