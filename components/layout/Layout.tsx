import MainNavigation from "./MainNavigation";
import { ReactNode } from "react";
interface PropsType {
  children: ReactNode;
}

const Layout: React.FC<PropsType> = ({ children }) => {
  return (
    <div>
      <MainNavigation></MainNavigation>
      <p>Stuff</p>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
