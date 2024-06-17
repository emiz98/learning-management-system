"use client";

import Course from "@/components/(dashboard)/course/user_course/course";
import Loader from "@/components/loaders/loader";
import ICourse from "@/interfaces/ICourse";
import { useQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface IResult {
  enrolledCourses: ICourse[];
  notEnrolledCourses: ICourse[];
}

const UserCoursesPage = () => {
  const [isChecked, setIsChecked] = useState(false);

  const { data, error, isLoading, refetch } = useQuery<IResult>({
    queryKey: ["user-courses"],
    queryFn: async () => fetchCourses(),
  });

  const fetchCourses = async () => {
    const { data, status } = await axios.get(`/api/course?groupBy=true`);
    if (status !== HttpStatusCode.Ok) {
      toast.error("Failed to fetch courses");
    } else {
      return data;
    }
  };

  return (
    <div className="bg-[#fafffc] h-screen p-5 overflow-y-scroll pb-24">
      <label className="relative inline-flex cursor-pointer select-none rounded-full bg-white border border-gray-200 w-max mb-5">
        <input
          type="checkbox"
          className="sr-only  "
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
        />
        <span
          className={`flex items-center space-x-[6px] rounded-l-full py-2 px-[18px] text-sm font-medium ${
            !isChecked ? "text-white bg-accent" : "text-body-color"
          }`}
        >
          Enrolled
        </span>
        <span
          className={`flex items-center space-x-[6px] rounded-r-full py-2 px-[18px] text-sm font-medium ${
            isChecked ? "text-white bg-accent" : "text-body-color"
          }`}
        >
          All Courses
        </span>
      </label>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {isChecked
            ? data?.notEnrolledCourses.map(({ id, title, description }) => (
                <Course
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                />
              ))
            : data?.enrolledCourses.map(({ id, title, description }) => (
                <Course
                  key={id}
                  id={id}
                  isEnrolled
                  title={title}
                  description={description}
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default UserCoursesPage;
