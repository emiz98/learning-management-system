import Loader from "@/components/loaders/loader";
import { twMerge } from "tailwind-merge";

interface Props {
  text: string;
  loadingText?: string;
  isSubmitting: boolean;
  className?: string;
}

const FormButton = ({ text, loadingText, isSubmitting, className }: Props) => {
  return (
    <button
      disabled={isSubmitting}
      type="submit"
      className={twMerge("btn btn-accent w-full mt-5 text-white", className)}
    >
      <div className="flex w-full items-center justify-center gap-x-2 text-white">
        <span>{isSubmitting ? loadingText : text}</span>
        {isSubmitting && <Loader />}
      </div>
    </button>
  );
};

export default FormButton;
