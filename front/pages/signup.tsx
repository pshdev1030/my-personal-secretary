import AppLayout from "@components/AppLayout";
import SignUpForm from "@components/SignUpForm";
import type { NextPage } from "next";

const SignUpPage: NextPage = () => {
  return (
    <div>
      <AppLayout>
        <SignUpForm />
      </AppLayout>
    </div>
  );
};

export default SignUpPage;
