"use client";
import { useFormik } from "formik";
import { logInSchema } from "../../../schema/authentication/loginSchema";
import AuthInput from "../../../components/auth/AuthInput";
import AuthButton from "../../../components/auth/AuthButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loginValues = {
  email: "",
  password: "",
};

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: loginValues,
      validationSchema: logInSchema,
      validateOnChange: true,
      validateOnBlur: true,
      onSubmit: async (values, action) => {
        console.log("🚀 ~ Login ~ action:", action);
        const data = {
          email: values?.email,
          password: values?.password,
        };
        router.push("/app/dashboard");
      },
    });

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full text-white">
      <div className="p-4 justify-center lg:flex hidden">
        <div className="max-w-[489px]">
          <img src={"/loginSideImg.png"} alt="logo" className="w-[489px]" />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-auto ">
        <div className="my-8 space-y-3 xxl:w-[400px] xxl:ml-12 text-center">
          <p className=" xxl:text-[48px] text-[36px] font-[600] capitalize">
            Log In
          </p>
          <p className="xxl:text-[26px] text-[16px] text-[#E6E6E6] ">
            Please enter your details to login
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="xxl:space-y-8 space-y-6 xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px]">
            <div className=" w-full">
              <AuthInput
                label={"Email Address"}
                text={"Email address"}
                placeholder={"Enter email address"}
                type={"email"}
                id={"email"}
                name={"email"}
                maxLength={30}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.email}
                touched={touched?.email}
              />
            </div>
            <div className=" w-full">
              <AuthInput
                label={"Password"}
                text={"Password"}
                placeholder={"Enter password here"}
                type={"password"}
                id={"password"}
                name={"password"}
                showToggle={true}
                maxLength={250}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors?.password}
                touched={touched?.password}
              />
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {/* <div className="flex justify-end xxl:w-[650px] lg:w-[350px] md:w-[550px] w-[320px]">
              <p
                type="button"
                className=" xxl:text-[20px] text-[12px] font-[500] cursor-pointer"
                onClick={() => router.push("/auth/forget-password")}
              >
                Forgot password?
              </p>
            </div> */}

            <div className="xxl:w-[650px] w-[350px] mt-1 mb-4">
              <AuthButton
                onClick={() => router.push("/dashboard")}
                type="button"
                text={"Login"}
                loading={loading}
                disabled={loading}
              />
            </div>
          </div>
        </form>
      </div>
      {/* {requestModal && (
        <RequestModal setIsOpen={setRequestModal} isLogin={true} />
      )} */}
    </div>
  );
};

export default Login;
