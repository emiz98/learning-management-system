"use client";

import InputField from "@/components/fields/input_field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import TextField from "@/components/fields/text_field";
import axios, { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import FormButton from "@/components/buttons/form_button/form_button";
import { CourseSchema } from "@/lib/zod_schemas";
import { revalidate } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import ICourse from "@/interfaces/ICourse";
import Loader from "@/components/loaders/loader";

type Props = {
  setIsOpen: Function;
  id: number;
};

interface IResult {
  course: ICourse;
}

type FormData = z.infer<typeof CourseSchema>;

const CourseForm = ({ setIsOpen, id }: Props) => {
  const { data, error, isLoading, refetch } = useQuery<IResult>({
    queryKey: ["admin-courses", id],
    queryFn: async () => fetchCourses(),
    enabled: !!id,
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(CourseSchema),
  });

  const fetchCourses = async () => {
    const { data, status } = await axios.get(`/api/course?id=${id}`);
    if (status !== HttpStatusCode.Ok) {
      toast.error("Failed to fetch courses");
    } else {
      setValue("title", data.course.title);
      setValue("description", data.course.description);
      return data;
    }
  };

  async function onSubmit(data: FormData) {
    let res;
    if (!!id) {
      res = await axios.put(`/api/course?id=${id}`, {
        title: data.title,
        description: data.description,
      });
    } else {
      res = await axios.post("/api/course", {
        title: data.title,
        description: data.description,
      });
    }

    if (
      res.status == HttpStatusCode.Created ||
      res.status == HttpStatusCode.Ok
    ) {
      toast.success(`Course ${!!id ? "updated" : "added"} successfully.`);
      revalidate("admin-courses");
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
          <h4 className="mb-2 text-sm text-gray-700">Course Name</h4>
          <InputField
            id="title"
            name="title"
            errors={errors.title?.message}
            placeholder="Course name"
            register={register}
            type="text"
            className="mb-2"
          />
          <h4 className="mb-2 text-sm text-gray-700">Description</h4>
          <TextField
            id="description"
            name="description"
            errors={errors.description?.message}
            placeholder="Description"
            register={register}
            type="text"
          />
          <FormButton
            isSubmitting={isSubmitting}
            text={`${!!id ? "Update" : "Add"} Course`}
            loadingText={`${!!id ? "Updating" : "Adding"} Course`}
          />
        </div>
      )}
    </form>
  );
};

export default CourseForm;
