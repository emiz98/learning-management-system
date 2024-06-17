import { HTMLInputTypeAttribute } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  register: any;
  id: string;
  name: string;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  title?: string;
  errors?: string;
  className?: string;
};

const InputField = ({
  register,
  errors,
  id,
  name,
  placeholder,
  title,
  type,
  className,
}: Props) => {
  return (
    <div className="relative w-full">
      {title && (
        <div className="mb-1 w-80 text-justify text-sm text-gray-700">
          {title}
        </div>
      )}
      <input
        {...register(name, {
          required: true,
          valueAsNumber: type == "number" ? true : false,
        })}
        id={id}
        name={name}
        type={type}
        className={twMerge(
          "block w-full input input-bordered bg-white text-sm text-black focus:border-0",
          className
        )}
        placeholder={placeholder}
      />
      {errors && <p className="text-xs text-red-500 mt-1 mb-2">{errors}</p>}
    </div>
  );
};

export default InputField;
