import MainNavigation from "./MainNavigation";
import { ReactNode } from "react";

interface PropsType {
  children: ReactNode;
}

const Layout: React.FC<PropsType> = ({ children }) => {
  return (
    <div style={{ display: "block" }}>
      <MainNavigation></MainNavigation>
      <main
        style={{
          paddingTop: "100px",
          textAlign: "center",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
