import { AuthenticationContext } from "@/app/context/AuthContext";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useBooking } from "../../../../../../hooks/useBooking";
import { CircularProgress } from "@mui/material";

interface ReserveFormProps {
  partySize: string;
  date: string;
  time: string;
  slug: string;
}

export const Form: React.FC<ReserveFormProps> = ({ partySize, date, time, slug }) => {
  const authContext = useContext(AuthenticationContext);
  const [form, setForm] = useState({
    firstName: authContext.data?.firstName || "",
    lastName: authContext.data?.lastName || "",
    phoneNumber: authContext.data?.phone || "",
    email: authContext.data?.email || "",
    occasion: "",
    requests: "",
  });
  const [disableButton, setDisabledButton] = useState(false);

  const {
    reservation: { loading, data: didBook, error },
    doReservation,
  } = useBooking();

  useEffect(() => {
    if (form.email === "" && form.firstName === "" && form.lastName === "" && form.email === "") {
      setDisabledButton(true);
    } else {
      setDisabledButton(false);
    }
  }, [form]);

  const handleCreateReservation = async () => {
    const booking = await doReservation({
      partySize,
      date,
      time,
      slug,
      user: {
        phone: form.phoneNumber,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        occasion: form.occasion,
        request: form.requests,
      },
    });
  };

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name: key, value } = event.target;

    setForm((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <div className="mt-10 flex flex-wrap justify-between gap-4 w-[100%]">
      {didBook ? (
        <div>
					<h1>You are all booked up</h1>
					<p>Enjoy your meating</p>
				</div>
      ) : (
        <>
          <input
            value={form.firstName}
            type="text"
            onChange={handleFormChange}
            name="firstName"
            className="border rounded p-3 w-[49%] mb-4 gap-4"
            placeholder="First name"
          />
          <input
            value={form.lastName}
            type="text"
            onChange={handleFormChange}
            name="lastName"
            className="border rounded p-3 w-[49%] mb-4 gap-4"
            placeholder="Last name"
          />
          <input
            value={form.phoneNumber}
            type="number"
            onChange={handleFormChange}
            name="phoneNumber"
            className="border rounded p-3 w-[49%] mb-4 gap-4"
            placeholder="Phone number"
          />
          <input
            value={form.email}
            type="email"
            onChange={handleFormChange}
            name="email"
            className="border rounded p-3 w-[49%] mb-4 gap-4"
            placeholder="Email"
          />
          <input
            value={form.occasion}
            type="text"
            onChange={handleFormChange}
            name="occasion"
            className="border rounded p-3 w-[49%] mb-4 gap-4"
            placeholder="Occasion (optional)"
          />
          <input
            value={form.requests}
            type="text"
            onChange={handleFormChange}
            name="requests"
            className="border rounded p-3 w-[49%] mb-4"
            placeholder="Requests (optional)"
          />
          <button
            className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
            onClick={handleCreateReservation}
            disabled={loading || disableButton}>
            {loading ? <CircularProgress /> : "Complete reservation"}
          </button>
          <p className="mt-4 text-sm">
            By clicking “Complete reservation” you agree to the OpenTable Terms of Use and Privacy Policy. Standard text
            message rates may apply. You may opt out of receiving text messages at any time.
          </p>
        </>
      )}
    </div>
  );
};
