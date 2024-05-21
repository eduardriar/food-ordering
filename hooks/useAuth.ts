import { AuthenticationContext } from "@/app/context/AuthContext";
import axios from "axios";
import { useContext } from "react";
import * as jose from "jose";
import { PrismaClient } from "@prisma/client";

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password?: string;
}

const prisma = new PrismaClient();

const useAuth = () => {
  const { data, error, loading, setAuthState } = useContext(AuthenticationContext);
  const signIn = async ({
    email,
    password,
    handleClose,
  }: {
    email: string;
    password: string;
    handleClose?: () => void;
  }) => {
    setAuthState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await axios.post("http://127.0.0.1:3000/api/auth/signin", {
        email,
        password,
      });

      setAuthState((prevState) => ({
        ...prevState,
        data: response.data,
        loading: false,
      }));
      handleClose && handleClose();
    } catch (error: any) {
      setAuthState((prevState) => ({
        ...prevState,
        error: [error.response.data.errorMessage] || [error.message],
        loading: false,
      }));
    }
  };
  const signUp = async (userInfo: UserInfo, handleClose?: () => void) => {
    setAuthState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const response = await axios.post("http://127.0.0.1:3000/api/auth/signup", {
        ...userInfo,
      });

      setAuthState((prevState) => ({
        ...prevState,
        data: response.data.user,
        loading: false,
      }));

      handleClose && handleClose();
    } catch (error: any) {
      setAuthState((prevState) => ({
        ...prevState,
        error: [error.response.data.errorMessage] || [error.message],
        loading: false,
      }));
    }
  };
  const signOut = () => {
    document.cookie = "jwt=; Max-Age=-9999999;";
    setAuthState({
      data: null,
      error: null,
      loading: false,
    });
  };

  return { signIn, signUp, signOut };
};

export default useAuth;
