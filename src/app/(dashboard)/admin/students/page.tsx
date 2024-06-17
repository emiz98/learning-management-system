"use client";

import BaseModal from "@/components/(dashboard)/modals/base_modal";
import IconButton from "@/components/buttons/icon_button/icon_button";
import CourseEnrollments from "@/components/forms/enrollment/course_enrollments/course_enrollments";
import DeleteStudent from "@/components/forms/student/delete_student/delete_student";
import StudentForm from "@/components/forms/student/student_form";
import Loader from "@/components/loaders/loader";
import IUser from "@/interfaces/IUser";
import { IUserRole } from "@/interfaces/IUserRole";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import axios, { HttpStatusCode } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import TimeAgo from "react-timeago";

interface IResult {
  users: IUser[];
}

const StudentsPage = () => {
  const [deleteUser, setDeleteUser] = useState<IUser | null>(null);
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [isEnrollment, setIsEnrollment] = useState<IUser | null>(null);

  const { data, error, isLoading, refetch } = useQuery<IResult>({
    queryKey: ["students"],
    queryFn: async () => fetchStudents(),
  });

  const fetchStudents = async () => {
    const { data, status } = await axios.get(
      `/api/user?role=${IUserRole.USER}`
    );
    if (status !== HttpStatusCode.Ok) {
      toast.error("Failed to fetch students.");
    } else {
      return data;
    }
  };

  return (
    <div className="bg-[#fafffc] h-screen p-5 overflow-y-scroll pb-24">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-screen-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 shadow-md">
              <thead className="text-xs text-gray-600 uppercase bg-gray-100">
                <tr>
                  {[
                    "id",
                    "username",
                    "email",
                    "created at",
                    "Enrollments",
                    "actions",
                  ].map((header, index) => (
                    <th key={index} scope="col" className="px-6 py-3">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data &&
                  data?.users.map((user, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {user.id}
                      </td>
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <TimeAgo date={user.createdAt} />
                      </td>

                      <td className="px-6 py-4">
                        <div
                          onClick={() =>
                            user.enrollments.length == 0
                              ? {}
                              : setIsEnrollment(user)
                          }
                          className={`text-sm px-4 py-2 w-max rounded-lg font-medium text-gray-500 ${
                            user.enrollments.length != 0 &&
                            "hover:bg-slate-200 duration-150 cursor-pointer"
                          }`}
                        >
                          {user.enrollments.length} Enrollments
                        </div>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-x-1">
                        <IconButton
                          Icon={PencilIcon}
                          onPressed={() => setEditUser(user)}
                          className="bg-blue-500 hover:bg-blue-600"
                        />
                        <IconButton
                          Icon={TrashIcon}
                          onPressed={() => setDeleteUser(user)}
                          className="bg-red-500 hover:bg-red-600"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {isEnrollment && (
            <BaseModal
              title={`Enrollments for ${isEnrollment.username}`}
              Content={CourseEnrollments}
              isOpen={isEnrollment != null}
              setIsOpen={setIsEnrollment}
              className="max-w-screen-md"
              id={isEnrollment.id}
            />
          )}

          {deleteUser && (
            <BaseModal
              title={`Delete Course ${deleteUser.username}`}
              Content={DeleteStudent}
              isOpen={deleteUser != null}
              setIsOpen={setDeleteUser}
              id={deleteUser.id}
            />
          )}

          {editUser && (
            <BaseModal
              title={`Edit Course ${editUser.username}`}
              Content={StudentForm}
              isOpen={editUser != null}
              setIsOpen={setEditUser}
              id={editUser.id}
            />
          )}
        </>
      )}
    </div>
  );
};

export default StudentsPage;
