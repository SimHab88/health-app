import MainNavigation from "./MainNavigation";
import { ReactNode } from "react";
interface PropsType {
  children: ReactNode;
}

const Layout: React.FC<PropsType> = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <MainNavigation></MainNavigation>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
