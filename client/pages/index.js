const LandingPage = ({ activeUser }) => {
  return activeUser ? (
    <h1>You are logged in</h1>
  ) : (
    <h1>You are NOT logged in</h1>
  );
};

LandingPage.getInitialProps = async (context, client, activeUser) => {
  return {};
};

export default LandingPage;
