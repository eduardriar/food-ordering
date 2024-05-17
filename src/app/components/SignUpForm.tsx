import React, { useEffect, useState } from "react";

const SignUpForm = () => {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
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
      <div className="my-3 flex justify-between gap-0.5 text-sm ">
        <input 
          type="text" 
          className="border rounded p-2 py-3 w-[49%]" 
          placeholder="First Name"
          value={inputs.firstName}
          name={'firstName'}
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
      <button className="uppercase bg-green-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400">
        Sign Up
      </button>
    </div>
  );
};

export default SignUpForm;
