"use client";
import Link from "next/link";
import AuthModal from "./AuthModal";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import useAuth from "../../../hooks/useAuth";

export const NavBar = () => {
  const { data, loading, setAuthState } = useContext(AuthenticationContext);
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        {" "}
        OpenTable{" "}
      </Link>
      <div>
        {!loading && (
          <div className="flex">
            {data ? (
              <button className="bg-blue text-black border p-1 px-4 rounded mr-3" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <AuthModal isSignIn>
                  <SignInForm />
                </AuthModal>
                <AuthModal isSignIn={false}>
                  <SignUpForm />
                </AuthModal>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
