import { Header } from "@/app/components/Header"
import { Metadata } from "next";
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Search OpenTable",
  description: "Generated by create next app",
};

const SearchLayout = ({children}: {children: ReactNode}) => {
  return(
    <main>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        {children}
      </div>
    </main>
  )
}

export default SearchLayout;