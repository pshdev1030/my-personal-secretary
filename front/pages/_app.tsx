import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import "react-toastify/dist/ReactToastify.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import Head from "next/head";
import "moment/locale/ko";
import { Global, css } from "@emotion/react";
import { SWRConfig } from "swr";
import { toast } from "react-toastify";
import { dbUrl } from "constant/api";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>My Personal Secretary</title>
      </Head>
      <Global
        styles={css`
          .ant-row {
            margin-right: 0 !important;
            margin-left: 0 !important;
          }

          .ant-col:first-of-type {
            padding-left: 0 !important;
          }

          .ant-col:last-of-type {
            padding-right: 0 !important;
          }
        `}
      />
      <SWRConfig
        value={{
          onError: (error, key) => {
            if (
              key === `${dbUrl}/user/login` ||
              "EventFormLocalState" ||
              "SecretaryLocalData"
            )
              return;

            if (error) {
              console.error(error);
            }
          },
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}

export default MyApp;
