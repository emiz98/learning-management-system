"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../fields/input_field";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { LOGO } from "@/lib/constants";
import axios, { HttpStatusCode } from "axios";
import { IUserRole } from "@/interfaces/IUserRole";
import FormButton from "../buttons/form_button/form_button";
import { UserSignUpSchema } from "@/lib/zod_schemas";

type FormData = z.infer<typeof UserSignUpSchema>;

const SignUpForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormData) {
    const res = await axios.post("/api/user", {
      username: data.username,
      email: data.email,
      password: data.password,
      role: IUserRole.USER,
    });

    if (res.status == HttpStatusCode.Created) {
      toast.success("Registration Successful.");
      router.push("/sign-in");
    } else {
      toast.error("Registration Failed.");
    }
  }

  return (
    <form
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[22rem] flex-col gap-y-2 border p-4 rounded-lg shadow-md bg-white"
    >
      <div className="flex items-center justify-center mb-5 gap-x-2">
        <Image
          src={LOGO}
          alt="logo_main"
          width={50}
          height={80}
          priority={true}
        />
        <h4 className="font-bold text-accent text-lg">AcademiX</h4>
      </div>

      <InputField
        id="username"
        name="username"
        errors={errors.username?.message}
        placeholder="Username"
        register={register}
        type="text"
      />
      <InputField
        id="email"
        name="email"
        errors={errors.email?.message}
        placeholder="Email"
        register={register}
        type="email"
      />
      <InputField
        id="password"
        name="password"
        errors={errors.password?.message}
        placeholder="Password"
        register={register}
        type="password"
      />
      <InputField
        id="confirmPassword"
        name="confirmPassword"
        errors={errors.confirmPassword?.message}
        placeholder="Confirm Password"
        register={register}
        type="password"
      />
      <div className="text-xs font-medium text-gray-500">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/sign-in")}
          className="cursor-pointer font-bold hover:underline"
        >
          Sign in
        </span>
      </div>
      <FormButton
        text="Sign up"
        loadingText="Signing up"
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default SignUpForm;
