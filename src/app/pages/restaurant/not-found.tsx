"use client"
import React from "react"
import Image from "next/image";
import errorMscot from "../../../../public/icons/error.png"

const NotFoundError = ({error}: {error: Error}) => {
  console.log(error.stack);
  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <Image src={errorMscot} alt="Image error" className="w-56 mb-8"/>
      <div className="bg-white p-9 py-14 shadow rounded">
        <h3 className="text-3xl font-bold">Well, this is embarrasing</h3>
        <p className="text-reg font-bold">We couldnt find that restaurant</p>
        <p className="mt-6 text-sm font-light"> Error Code: 400</p>
      </div>
    </div>
  )
};

export default NotFoundError;
