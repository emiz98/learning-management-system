"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../fields/input_field";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { LOGO } from "@/lib/constants";
import { signIn } from "next-auth/react";
import FormButton from "../buttons/form_button/form_button";
import { UserSchema } from "@/lib/zod_schemas";

type FormData = z.infer<typeof UserSchema>;

const SignInForm = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema),
  });

  async function onSubmit(data: FormData) {
    const signInData = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (signInData?.error) {
      toast.error("Sorry! Something went wrong.");
    } else {
      toast.success("Successfully logged in.");
      router.push("/admin");
    }
  }

  return (
    <form
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-80 flex-col gap-y-2 border p-4 rounded-lg shadow-md bg-white"
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
      <div className="text-xs font-medium text-gray-500">
        Don&apos;t have an account?{" "}
        <span
          onClick={() => router.push("/sign-up")}
          className="cursor-pointer font-bold hover:underline"
        >
          Sign up
        </span>
      </div>
      <FormButton
        text="Sign in"
        loadingText="Signing in"
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default SignInForm;
