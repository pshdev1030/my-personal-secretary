import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import "react-toastify/dist/ReactToastify.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import Head from "next/head";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>My Personal Secretary</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
