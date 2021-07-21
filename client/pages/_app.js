import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/Header";
import Head from "next/head";
import favicon from "../public/favicon.ico";

const AppComponent = ({ Component, pageProps, activeUser }) => {
  return (
    <div>
      <Head>
        <link rel="shortcut image" href={favicon} type="image/x-icon" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
      </Head>
      <Header activeUser={activeUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/activeuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
