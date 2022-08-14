const SignupForm: React.FC = () => {
  return (
    // <div>HI</div>
    <form>
      <div className="input-container" style={{ paddingTop: "0px" }}>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="First Name"
        ></input>
      </div>
    </form>
  );
};

export default SignupForm;
