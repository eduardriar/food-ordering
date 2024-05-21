"use client";

import { useState, createContext, Dispatch, SetStateAction, useEffect } from "react";
import useAuth, { UserInfo } from "../../../hooks/useAuth";
import axios from "axios";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

interface State {
  loading: boolean;
  data: User | null;
  error: string[] | null;
}

interface AuthState extends State {
  setAuthState: Dispatch<SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthState>({
  loading: false,
  error: null,
  data: null,
  setAuthState: () => {},
});

export default function AuthContext({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    const cookieStore = document.cookie;
    const jwtToken = cookieStore.split(" ").filter((cookie) => cookie.includes("jwt="))[0];

    if (!jwtToken) {
      return setAuthState({
        data: null,
        error: null,
        loading: false,
      });
    } else {
      try {
        const token = `Bearer ${jwtToken.split("=")[1]}`;

        setAuthState((prevState) => ({
          ...prevState,
          loading: true,
        }));

        const response = await axios.get("http://127.0.0.1:3000/api/auth/me", {
          headers: {
            authorization: token,
          },
        });

        axios.defaults.headers.common["Authorization"] = token;

        const user: UserInfo = {
          firstName: response.data.me["first_name"],
          lastName: response.data.me["last_name"],
          email: response.data.me["email"],
          phone: response.data.me["phone"],
          city: response.data.me["city"],
        };

        setAuthState((prevState) => ({
          ...prevState,
          data: user,
          loading: false,
        }));
      } catch (error: any) {
        setAuthState((prevState) => ({
          ...prevState,
          error: [error],
          loading: false,
        }));
      }
    }
  };

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>{children}</AuthenticationContext.Provider>
  );
}
