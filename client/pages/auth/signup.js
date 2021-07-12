const SignUp = () => {
  return (
    <form>
      <h1>Sign Up Page</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input className="form-control" type="password" />
      </div>
      <button className="btn btn-outline-primary "> Create new account </button>
    </form>
  );
};

export default SignUp;
