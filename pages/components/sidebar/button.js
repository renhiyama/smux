import { useEffect } from "react"

let icons = {
  "workspace": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
  </svg>,
  "files": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path>
  </svg>,
  "search": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <circle cx="10" cy="10" r="7"></circle>
    <path d="M21 21l-6 -6"></path>
    <path d="M8 8l-2 2l2 2"></path>
    <path d="M12 8l2 2l-2 2"></path>
  </svg>,
  "source-control": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <circle cx="7" cy="18" r="2"></circle>
    <circle cx="7" cy="6" r="2"></circle>
    <circle cx="17" cy="12" r="2"></circle>
    <line x1="7" y1="8" x2="7" y2="16"></line>
    <path d="M7 8a4 4 0 0 0 4 4h4"></path>
  </svg>,
  "account": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <circle cx="12" cy="7" r="4"></circle>
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
  </svg>,
  "settings": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>,
  "go-back": <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeLinecap="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
    <polyline points="7 11 12 16 17 11"></polyline>
    <line x1="12" y1="4" x2="12" y2="16"></line>
  </svg>
}
export default function Button({ name, isActive }) {
  return (
    <>
      <button name={name}
        className={`sidebar-icons${isActive?" text-cyan-500": ""}${name == "source-control" ? " mb-auto" : ""}${name == "account" ? " mt-auto" : ""}${name == "go-back" ? " mb-0 rotate-90" : ""}`}>
        {icons[name]}</button>
    </>
  )
}