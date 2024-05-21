"use client";
import React, { useContext, useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";

interface SignInFormProps {
  handleClose?: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ handleClose }) => {
  const [disabled, setDisabled] = useState(true);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const { data, error, loading } = useContext(AuthenticationContext);
  const { signIn } = useAuth();

  useEffect(() => {
    if (Object.values(inputs).every((input) => input.length > 0)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputs]);

  const handleSetInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const key = event.target.name;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
    }));
  };

  const handleClick = () => {
    signIn({
      email: inputs.email,
      password: inputs.password,
      handleClose,
    });
  };

  return (
    <div>
      {loading ? (
        <div className="py-24 px-2 flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="my-3 flex flex-col justify-between gap-1 text-sm">
            <input
              type="email"
              className="border rounded p-2 py-3 w-full"
              placeholder="Email"
              value={inputs.email}
              name="email"
              onChange={(event) => handleSetInput(event)}
            />
            <input
              type="password"
              className="border rounded p-2 py-3 w-full"
              placeholder="Password"
              value={inputs.password}
              name="password"
              onChange={(event) => handleSetInput(event)}
            />
          </div>
          <button
            disabled={disabled}
            className="uppercase bg-green-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
            onClick={handleClick}>
            Sign In
          </button>
          {error && (
            <Alert severity="error">
              <ul>
                {error.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default SignInForm;
