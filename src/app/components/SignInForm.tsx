import React, { useState } from "react";

const SignInForm = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleSetInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const key = event.target.name;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [key]: value,
    }));
  };

  return (
    <div>
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
      <button className="uppercase bg-green-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400">
        Sign In
      </button>
    </div>
  );
};

export default SignInForm;