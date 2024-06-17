import IconButton from "@/components/buttons/icon_button/icon_button";
import Loader from "@/components/loaders/loader";
import IUser from "@/interfaces/IUser";
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
    user: IUser;
  }[];
}

const UserEnrollments = ({ id, setIsOpen }: Props) => {
  const [confirm, setConfirm] = useState<number | null>(null);
  const { data, error, isLoading, refetch } = useQuery<IResult>({
    queryKey: ["enrollment-students"],
    queryFn: async () => fetchStudents(),
  });

  const fetchStudents = async () => {
    const { data, status } = await axios.get(`/api/enrollment?courseId=${id}`);
    if (status !== HttpStatusCode.Ok) {
      toast.error("Failed to fetch students.");
    } else {
      return data;
    }
  };

  async function onSubmit(userId: number) {
    const res = await axios.delete(
      `/api/enrollment?courseId=${id}&userId=${userId}`
    );
    if (res.status == HttpStatusCode.Ok) {
      toast.success("Enrollment deleted successfully");
    } else {
      toast.success("Something went wrong!");
    }
    revalidate("admin-courses");
    revalidate("enrollment-students");
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
                  {["id", "username", "email", "actions"].map(
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
                  data?.enrollments.map((user, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {user.user.id}
                      </td>
                      <td className="px-6 py-4">{user.user.username}</td>
                      <td className="px-6 py-4">{user.user.email}</td>
                      <td className="px-6 py-4 flex items-center gap-x-1">
                        {confirm == index ? (
                          <div className="flex items-center gap-x-1">
                            <IconButton
                              Icon={CheckIcon}
                              onPressed={() => onSubmit(user.user.id)}
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

export default UserEnrollments;
