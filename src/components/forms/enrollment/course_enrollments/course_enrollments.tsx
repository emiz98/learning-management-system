import IconButton from "@/components/buttons/icon_button/icon_button";
import Loader from "@/components/loaders/loader";
import ICourse from "@/interfaces/ICourse";
import { revalidate } from "@/lib/actions";
import { TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  setIsOpen: Function;
  id: number;
};

interface IResult {
  enrollments: {
    course: ICourse;
  }[];
}

const CourseEnrollments = ({ id, setIsOpen }: Props) => {
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data, error, isLoading, refetch } = useQuery<IResult>({
    queryKey: ["enrollment-courses"],
    queryFn: async () => fetchCourses(),
  });

  const fetchCourses = async () => {
    const { data, status } = await axios.get(`/api/enrollment?userId=${id}`);
    if (status !== HttpStatusCode.Ok) {
      toast.error("Failed to fetch courses.");
    } else {
      return data;
    }
  };

  async function onSubmit(courseId: number) {
    const res = await axios.delete(
      `/api/enrollment?courseId=${courseId}&userId=${id}`
    );
    if (res.status == HttpStatusCode.Ok) {
      toast.success("Enrollment deleted successfully");
    } else {
      toast.success("Something went wrong!");
    }
    revalidate("students");
    revalidate("enrollment-courses");
  }

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-screen-lg max-h-[50vh]">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow-md">
              <thead className="text-xs text-gray-600 uppercase bg-gray-100">
                <tr>
                  {["id", "title", "description", "actions"].map(
                    (header, index) => (
                      <th key={index} scope="col" className="px-6 py-3">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.enrollments.map(({ course }, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {course.id}
                      </td>
                      <td className="px-6 py-4">{course.title}</td>
                      <td className="px-6 py-4">{course.description}</td>
                      <td className="px-6 py-4 flex items-center gap-x-1">
                        {confirm == index ? (
                          <div className="flex items-center gap-x-1">
                            <IconButton
                              Icon={CheckIcon}
                              onPressed={() => onSubmit(course.id)}
                              className="bg-green-500 hover:bg-green-600"
                            />
                            <IconButton
                              Icon={XMarkIcon}
                              onPressed={() => setConfirm(null)}
                              className="bg-gray-500 hover:bg-gray-600"
                            />
                          </div>
                        ) : (
                          <IconButton
                            Icon={TrashIcon}
                            onPressed={() => setConfirm(index)}
                            className="bg-red-500 hover:bg-red-600"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseEnrollments;
