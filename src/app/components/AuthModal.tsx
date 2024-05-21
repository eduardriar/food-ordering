"use client";
import * as React from "react";
import Box from "@mui/material/Box";

import { useContext, useState } from "react";
import { Modal as MuiModal } from "@mui/material";
import { AuthenticationContext } from "../context/AuthContext";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
interface ModalProps {
  isSignIn: boolean;
  children?: React.ReactElement;
}

export default function AuthModal({ isSignIn, children }: ModalProps) {
  const {error} = useContext(AuthenticationContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { data } = useContext(AuthenticationContext);

  const renderContent = (signInContent: string, signUpContent: string) => (isSignIn ? signInContent : signUpContent);

  const childrenWithProps = React.Children.map(children, child => {
    if(React.isValidElement(child)){
      return React.cloneElement(child, {handleClose} as any)
    }
  })

  return (
    <div>
      <button
        className={`${renderContent("bg-blue-400 text-white mr-3", "")} border p-1 px-4 rounded`}
        onClick={handleOpen}>
        {renderContent("Sign In", "Sign Up")}
      </button>

      <MuiModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <div className="p-2">
            <div className="uppercase font-bold text-center pb-2 border-b mb-3">
              <p className="text-sm">{renderContent("Sign In", "Create Account")}</p>
            </div>
            <div className="m-auto">
              <h2 className="text-2xl font-light text-center">
                <p className="text-sm">{renderContent("Log Into Your Account", "Create your OpenTable account")}</p>
              </h2>
            </div>
            {childrenWithProps}
          </div>
        </Box>
      </MuiModal>
    </div>
  );
}
