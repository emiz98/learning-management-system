"use client";

import InputField from "@/components/fields/input_field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TextField from "@/components/fields/text_field";
import axios, { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import FormButton from "@/components/buttons/form_button/form_button";
import { UserUpdateSchema } from "@/lib/zod_schemas";
import { revalidate } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loaders/loader";
import IUser from "@/interfaces/IUser";

type Props = {
  setIsOpen: Function;
  id: number;
};

interface IResult {
  user: IUser;
}

type FormData = z.infer<typeof UserUpdateSchema>;

const StudentForm = ({ setIsOpen, id }: Props) => {
  const { data, error, isLoading, refetch } = useQuery<IResult>({
    queryKey: ["students", id],
    queryFn: async () => fetchCourses(),
    enabled: !!id,
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(UserUpdateSchema),
  });

  const fetchCourses = async () => {
    const { data, status } = await axios.get(`/api/user?id=${id}`);
    if (status !== HttpStatusCode.Ok) {
      toast.error("Failed to fetch courses");
    } else {
      setValue("username", data.user.username);
      setValue("email", data.user.email);
      return data;
    }
  };

  async function onSubmit(data: FormData) {
    let res;
    if (!!id) {
      res = await axios.put(`/api/user?id=${id}`, {
        username: data.username,
        email: data.email,
      });
    } else {
      res = await axios.post("/api/user", {});
    }

    if (
      res.status == HttpStatusCode.Created ||
      res.status == HttpStatusCode.Ok
    ) {
      toast.success(`Course ${!!id ? "updated" : "added"} successfully.`);
      revalidate("students");
      setIsOpen(false);
    } else {
      toast.error("Something went wrong!");
    }
  }

  return (
    <form method="POST" onSubmit={handleSubmit(onSubmit)}>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <h4 className="mb-2 text-sm text-gray-700">Username</h4>
          <InputField
            id="username"
            name="username"
            errors={errors.username?.message}
            placeholder="Username"
            register={register}
            type="text"
            className="mb-2"
          />
          <h4 className="mb-2 text-sm text-gray-700">Email</h4>
          <TextField
            id="email"
            name="email"
            errors={errors.email?.message}
            placeholder="Email"
            register={register}
            type="text"
          />
          <FormButton
            isSubmitting={isSubmitting}
            text={`${!!id ? "Update" : "Add"} User`}
            loadingText={`${!!id ? "Updating" : "Adding"} User`}
          />
        </div>
      )}
    </form>
  );
};

export default StudentForm;
