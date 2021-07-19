import axios from "axios";

const LandingPage = ({ activeUser }) => {
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
  if (typeof window === undefined) {
    const { data } = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/activeuser"
    );

    headers: {
      Host: "mentmint.dev";
    }

    return data;
  } else {
    const { data } = await axios.get("/api/users/activeuser");
    return data;
  }
  return {};
};

export default LandingPage;
