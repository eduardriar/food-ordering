"use client"
import React, { useContext, useEffect, useState } from "react";
import useAuth, { UserInfo } from "../../../hooks/useAuth";
import { AuthenticationContext } from "../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";

interface SignUpFormProps {
  handleClose?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ handleClose }) => {
  const [disabled, setDisabled] = useState(true);
  const [inputs, setInputs] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });
  const { error, loading } = useContext(AuthenticationContext);
  const { signUp } = useAuth();

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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    signUp(inputs, handleClose);
  };

  return (
    <div>
      {loading ? (
        <div className="py-24 px-2 flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="my-3 flex justify-between gap-0.5 text-sm ">
            <input
              type="text"
              className="border rounded p-2 py-3 w-[49%]"
              placeholder="First Name"
              value={inputs.firstName}
              name={"firstName"}
              onChange={(event) => handleSetInput(event)}
            />
            <input
              type="text"
              className="border rounded p-2 py-3 w-[49%]"
              placeholder="Last Name"
              value={inputs.lastName}
              name="lastName"
              onChange={(event) => handleSetInput(event)}
            />
          </div>
          <div className="my-3 flex justify-between text-sm">
            <input
              type="email"
              className="border rounded p-2 py-3 w-full"
              placeholder="Email"
              value={inputs.email}
              name="email"
              onChange={(event) => handleSetInput(event)}
            />
          </div>
          <div className="my-3 flex justify-between gap-0.5 text-sm">
            <input
              type="tel"
              className="border rounded p-2 py-3 w-[49%]"
              placeholder="Phone"
              value={inputs.phone}
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              name="phone"
              onChange={(event) => handleSetInput(event)}
            />
            <input
              type="text"
              className="border rounded p-2 py-3 w-[49%]"
              placeholder="City"
              value={inputs.city}
              name="city"
              onChange={(event) => handleSetInput(event)}
            />
          </div>
          <div className="my-3 flex justify-between text-sm">
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
            Sign Up
          </button>
        </>
      )}
      {error && (
        <Alert severity="error">
          <ul>
            {error.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
};

export default SignUpForm;
