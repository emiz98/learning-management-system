import axios, { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import PrimaryButton from "@/components/buttons/primary_button/primary_button";
import { revalidate } from "@/lib/actions";

type Props = {
  id: number;
  setIsOpen: Function;
};

const DeleteStudent = ({ id, setIsOpen }: Props) => {
  async function onSubmit() {
    const res = await axios.delete(`/api/user?id=${id}`);
    if (res.status == HttpStatusCode.Ok) {
      toast.success("Student deleted successfully");
    } else {
      toast.success("Something went wrong!");
    }
    revalidate("students");
    setIsOpen(null);
  }

  return (
    <div>
      <div className="px-5 py-2 rounded-md shadow-md bg-white border border-slate-100 text-gray-500 mt-2 text-sm flex items-start gap-x-2">
        <InformationCircleIcon className="h-5 w-5" />
        <p>
          Deleting user will unassign all the enrollments that a user associated
          with.
        </p>
      </div>
      <PrimaryButton
        onPressed={() => onSubmit()}
        title="Delete Student"
        className="w-full !btn-error mt-4 !text-white"
      />
    </div>
  );
};

export default DeleteStudent;
