import Calander from 'components/Calender';
import React, { ReactElement } from 'react';
import { ToastContainer } from 'react-toastify';
import AppLayout from '../components/AppLayout';

const Example = (): ReactElement => {
  return (
    <>
      <AppLayout>
        <Calander />
      </AppLayout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Example;
