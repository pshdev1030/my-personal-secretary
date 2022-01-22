import AppLayout from "@components/AppLayout";
import Secretary from "@components/Secretary";
import type { NextPage } from "next";

const SecretaryPage: NextPage = () => {
  return (
    <>
      <AppLayout>
        <Secretary />
      </AppLayout>
    </>
  );
};

export default SecretaryPage;
