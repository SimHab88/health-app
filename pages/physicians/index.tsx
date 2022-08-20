import type { NextPage } from "next";
import { Fragment } from "react";
import Link from "next/link";

const Physicians: NextPage = () => {
  return (
    <Fragment>
      <div>Physicians</div>
      <Link href="diseases/headache">Headache</Link>
    </Fragment>
  );
};

export default Physicians;
