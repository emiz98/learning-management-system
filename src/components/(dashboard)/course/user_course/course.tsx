import FormButton from "@/components/buttons/form_button/form_button";
import { revalidate } from "@/lib/actions";
import { EnrollmentSchema } from "@/lib/zod_schemas";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { HttpStatusCode } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface Props {
  id: number;
  title: string;
  description: string;
  isEnrolled?: boolean;
}

type FormData = z.infer<typeof EnrollmentSchema>;

const Course = ({ id, title, description, isEnrolled }: Props) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(EnrollmentSchema),
  });

  useEffect(() => {
    setValue("courseId", id);
  }, []);

  async function onSubmit(data: FormData) {
    const res = await axios.post("/api/enrollment", {
      courseId: data.courseId,
    });
    if (res.status == HttpStatusCode.Created) {
      toast.success("Successfully enrolled.");
      revalidate("user-courses");
    } else {
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="card bg-white shadow-lg p-4 flex flex-col justify-between">
      <div className="flex items-start gap-x-4">
        <div className="w-8 h-8">
          <AcademicCapIcon className="w-8 h-8 bg-accent p-1 rounded-lg text-white" />
        </div>
        <div>
          <h2 className="font-medium">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
      </div>

      {!isEnrolled && (
        <form method="POST" onSubmit={handleSubmit(onSubmit)}>
          <FormButton
            isSubmitting={isSubmitting}
            text="Enroll now"
            loadingText="Enrolling"
          />
        </form>
      )}
    </div>
  );
};

export default Course;
