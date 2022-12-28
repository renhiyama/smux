import { useRouter } from "next/router";
import { useEffect } from "react";
export default function FakeFresh(){
  const router = useRouter();
  useEffect(()=>{
    router.push("/files");
  },[]);
  return(
    <></>
  )
}