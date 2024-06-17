"use client";

import Course from "@/components/(dashboard)/course/admin_course/course";
import BaseModal from "@/components/(dashboard)/modals/base_modal";
import PrimaryButton from "@/components/buttons/primary_button/primary_button";
import CourseForm from "@/components/forms/course/course_form";
import Loader from "@/components/loaders/loader";
import ICourse from "@/interfaces/ICourse";
import { useQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface IResult {
  courses: ICourse[];
}

const AdminCoursesPage = () => {
  const [isModal, setIsModal] = useState(false);
  const { data, error, isLoading, refetch } = useQuery<IResult>({
    queryKey: ["admin-courses"],
    queryFn: async () => fetchCourses(),
  });

  const fetchCourses = async () => {
    const { data, status } = await axios.get(`/api/course`);
    if (status !== HttpStatusCode.Ok) {
      toast.error("Failed to fetch courses");
    } else {
      return data;
    }
  };

  return (
    <div className="bg-[#fafffc] h-screen p-5 overflow-y-scroll pb-24">
      <PrimaryButton
        onPressed={() => setIsModal(true)}
        title="Add Course"
        className="mb-5"
      />

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {data?.courses.map(({ id, title, description, enrollments }) => (
            <Course
              key={id}
              id={id}
              title={title}
              description={description}
              enrollments={enrollments.length}
            />
          ))}
        </div>
      )}

      {isModal && (
        <BaseModal
          title="Add Course"
          Content={CourseForm}
          isOpen={isModal}
          setIsOpen={setIsModal}
        />
      )}
    </div>
  );
};

export default AdminCoursesPage;
