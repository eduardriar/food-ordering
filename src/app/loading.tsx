import React from "react"
import { Header } from "./components/Header";

// Next by default when a loading component is detected over the src/app route it'll be the loading state for the complete application unless we give him another loading file in the location we need

const Loading = () => {
  return (
    <main>
       <Header />
       <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
          {Array.from({length: 12}).map((param, index) => (
            <div key={index} className="animate-pulse bg-slate-200 w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer"></div>
          ))}
       </div>
    </main>
  )
};

export default Loading;
