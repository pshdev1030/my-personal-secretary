import AppLayout from "@components/AppLayout";
import Calendar from "@components/Calendar";
import type { NextPage } from "next";
import { useState } from "react";
import { Modal } from "antd";

const Home: NextPage = () => {
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  return (
    <>
      <AppLayout>
        <Calendar />
      </AppLayout>
      {isModalOpened && <Modal />}
    </>
  );
};

export default Home;
