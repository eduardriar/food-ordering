"use client";
import Link from "next/link";
import AuthModal from "./AuthModal";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";

export const NavBar = () => {
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        {" "}
        OpenTable{" "}
      </Link>
      <div>
        <div className="flex">
          <AuthModal isSignIn>
            <SignInForm />
          </AuthModal>
          <AuthModal isSignIn={false}>
            <SignUpForm />
          </AuthModal>
        </div>
      </div>
    </nav>
  );
};
