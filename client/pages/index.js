import axios from "axios";

const LandingPage = ({ activeUser }) => {
  console.log(activeUser);
  return <h1>Hello, {activeUser?.email ?? "user"}</h1>;
};

export const getServerSideProps = async ({ req }) => {
  let res;
  if (typeof window === "undefined") {
    res = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/activeuser",
      {
        withCredentials: true,
        headers: req.headers,
      }
    );
  } else {
    res = await axios.get("/api/users/activeuser");
  }
  return { props: res.data };
};

export default LandingPage;
