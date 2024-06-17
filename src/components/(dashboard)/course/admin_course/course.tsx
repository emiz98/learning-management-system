import IconButton from "@/components/buttons/icon_button/icon_button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import BaseModal from "../../modals/base_modal";
import DeleteCourse from "@/components/forms/course/delete_course/delete_course";
import UserEnrollments from "@/components/forms/enrollment/user_enrollments/user_enrollments";
import CourseForm from "@/components/forms/course/course_form";

interface Props {
  id: number;
  title: string;
  description: string;
  enrollments: number;
}

const Course = ({ id, title, description, enrollments }: Props) => {
  const [isEnrollmentModal, setIsEnrollmentModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);

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
      <div className="flex items-center mt-6 justify-between">
        <div
          onClick={() => (enrollments == 0 ? {} : setIsEnrollmentModal(true))}
          className={`text-sm px-4 py-2 rounded-lg font-medium text-gray-500 ${
            enrollments != 0 && "hover:bg-slate-100 duration-150 cursor-pointer"
          }`}
        >
          {enrollments} Enrollments
        </div>
        <div className="flex items-center gap-x-1 ">
          <IconButton
            Icon={PencilIcon}
            onPressed={() => setIsEditModal(true)}
            className="bg-blue-500 hover:bg-blue-600"
          />
          <IconButton
            Icon={TrashIcon}
            onPressed={() => setIsDeleteModal(true)}
            className="bg-red-500 hover:bg-red-600"
          />
        </div>
      </div>

      {isDeleteModal && (
        <BaseModal
          title={`Delete Course ${title}`}
          Content={DeleteCourse}
          isOpen={isDeleteModal}
          setIsOpen={setIsDeleteModal}
          id={id}
        />
      )}

      {isEnrollmentModal && (
        <BaseModal
          title={`Enrollments for ${title}`}
          Content={UserEnrollments}
          isOpen={isEnrollmentModal}
          setIsOpen={setIsEnrollmentModal}
          className="max-w-screen-md"
          id={id}
        />
      )}

      {isEditModal && (
        <BaseModal
          title={`Edit Course ${title}`}
          Content={CourseForm}
          isOpen={isEditModal}
          setIsOpen={setIsEditModal}
          id={id}
        />
      )}
    </div>
  );
};

export default Course;
