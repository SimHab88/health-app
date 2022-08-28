import type { NextPage } from "next";
import DiseaseForm from "../../components/DiseaseForm";

const Diseases: NextPage = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
    >
      <DiseaseForm></DiseaseForm>
    </div>
  );
};

export default Diseases;
