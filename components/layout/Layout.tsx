import MainNavigation from "./MainNavigation";
import { ReactNode } from "react";
import { AuthProvider } from "../../hooks/auth";
interface PropsType {
  children: ReactNode;
}

const Layout: React.FC<PropsType> = ({ children }) => {
  return (
    <div
      style={{
        margin: "0px",
        padding: "0px",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ top: "0px" }}>
        <MainNavigation></MainNavigation>
      </div>
      <div
        style={{
          width: "100%",
          height: "calc(100% - var(--navHeight))",
          position: "absolute",
          maxHeight: "calc(100% - var(--navHeight))",
          top: "var(--navHeight)",
          overflow: "auto",
        }}
      >
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
