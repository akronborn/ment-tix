import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const LogOut = () => {
  const { makeRequest } = useRequest({
    url: "/api/users/logout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    makeRequest();
  }, []);

  return <div>Logging out user..</div>;
};

export default LogOut;
