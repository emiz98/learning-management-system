import { twMerge } from "tailwind-merge";

interface Props {
  onPressed: Function;
  className?: string;
  Icon: any;
}

const IconButton = ({ onPressed, className, Icon }: Props) => {
  return (
    <button
      onClick={() => onPressed()}
      className={twMerge(
        `bg-accent p-2 duration-150 rounded-lg cursor-pointer text-white`,
        className
      )}
    >
      <Icon className="h-5 object-contain" />
    </button>
  );
};

export default IconButton;
