import buildClient from "../api/build-client";

const LandingPage = ({ activeUser }) => {
  return activeUser ? (
    <h1>You are logged in</h1>
  ) : (
    <h1>You are NOT logged in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGE!");
  const client = buildClient(context);
  const { data } = await client.get("/api/users/activeuser");

  return data;
};

export default LandingPage;
