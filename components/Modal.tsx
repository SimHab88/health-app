import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import classes from "./Modal.module.css";

interface PropsType {
  children: ReactNode;
  link: string;
}

const Modal: React.FC<PropsType> = ({ children, link }) => {
  const router = useRouter();

  return (
    <div className={classes.overlay} onClick={() => router.back()}>
      <div
        className={classes.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <AiOutlineCloseCircle
          onClick={() => router.back()}
          size="30"
          style={{
            position: "fixed",
            top: "8px",
            right: " 8px",
            cursor: "pointer",
          }}
        ></AiOutlineCloseCircle>

        {children}
      </div>
    </div>
  );
};

export default Modal;
