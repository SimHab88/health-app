import type { NextPage } from "next";
import { useRouter } from "next/router";

const Disease: NextPage = () => {
  const router = useRouter();
  const disease = router.query.disease;

  return <div>Specific disease: {disease}</div>;
};

export default Disease;
