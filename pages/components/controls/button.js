import React, { useState, useEffect, useRef } from "react";
let icons = {
  search: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
    name="search" className="ml-auto control-icons">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>,
  location: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
    name="location" className="control-icons">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>,
  "new-file": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
    name="new-file" className="control-icons">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>,
  "new-folder": <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
    name="new-folder" className="control-icons">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>,
  more: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
    name="more" className="control-icons">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
}
export default function Button({ name, onClick }) {
  //show a tooltip when hovering over the button, use absolute positioning to show it
  let [showTooltip, setShowTooltip] = useState(false);
  let [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  let buttonRef = useRef();
  useEffect(() => {
    let button = buttonRef.current;
    let rect = button.getBoundingClientRect();
    setTooltipPosition({ top: rect.top + rect.height + 5, left: rect.left - 5 });
  }
    , []);
  let showtmr;
  let show = () => {
    showtmr = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
  }
  let hide = () => {
    if (showtmr) clearTimeout(showtmr);
    setShowTooltip(false);
  }
  let runandhide = () => {
    if(onClick) onClick();
    hide();
  }
  return (
    <div ref={buttonRef} onMouseEnter={show} onMouseLeave={hide}>
      <button onClick={runandhide}>
        {icons[name]}
      </button>
      {showTooltip && <div
        className="absolute bg-black/50 text-white font-bold text-md capitalize rounded-md p-2 shadow-lg shadow-black/50" style={tooltipPosition}>
        {name.replaceAll("-", " ")}</div>}
    </div>
  )
}