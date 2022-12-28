import { useEffect } from 'react';
import SidebarButton from './sidebar/button';
import { useRouter } from 'next/router'

export default function Navbar({}){
  const router = useRouter();
  useEffect(()=>{
    //when a user clicks sidebar button, text-cyan-500 is added to the button
    let buttons = document.querySelectorAll("#nav button");
    buttons.forEach((button)=>{
      button.addEventListener("click", (e)=>{
        buttons.forEach((button)=>{
          button.classList.remove("text-cyan-500");
        })
        //get the button that was clicked
        let clickedButton = e.target;
        //if the clickedButton is svg or path, get the parent button
        while(clickedButton.tagName !== "BUTTON"){
          clickedButton = clickedButton.parentElement;
        };
        //add text-cyan-500 to the clicked button
        clickedButton.classList.add("text-cyan-500");
        let value = clickedButton.getAttribute("name");
        if(value=="go-back") router.push("/");
        else router.push(`/${value}`)
      })
    });
  });
  return (
  <div id="nav" className="z-100 text-white to-slate-900 py-4
      fixed left-0 h-screen w-12 m-0 flex flex-col z-0 bg-gradient-to-r rounded-r-md from-gray-900
      ">
    <SidebarButton name="workspace" />
    <SidebarButton name="files" />
    <SidebarButton name="search" />
    <SidebarButton name="source-control" />
    <SidebarButton name="account" />
    <SidebarButton name="settings" />
    <SidebarButton name="go-back" />
  </div>
  )
}