"use client";

import { signUpSchema } from "@/lib/validation";
import { signUp } from "@/actions/auth";
import AuthForm from "@/components/auth-form";

const SignUpPage = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={signUp}
    />
  );
};

export default SignUpPage;
