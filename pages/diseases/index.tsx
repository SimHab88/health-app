import type { NextPage } from "next";
import { Fragment } from "react";
import Link from "next/link";

const Diseases: NextPage = () => {
  return (
    <Fragment>
      <div>Search</div>
      <div>Add</div>
      <div>Most traffic</div>
      <Link href="diseases/headache">Headache</Link>
    </Fragment>
  );
};

export default Diseases;
