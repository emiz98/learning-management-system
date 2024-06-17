import { twMerge } from "tailwind-merge";

interface Props {
  title: string;
  onPressed: Function;
  className?: string;
  Icon?: JSX.Element;
  isLeading?: boolean;
}

const PrimaryButton = ({
  title,
  onPressed,
  className,
  Icon,
  isLeading,
}: Props) => {
  return (
    <button
      onClick={() => onPressed()}
      className={twMerge(
        `btn btn-accent flex items-center gap-x-1 text-white ${
          isLeading && "flex-row-reverse"
        }`,
        className
      )}
    >
      <span>{title}</span>
      {Icon}
    </button>
  );
};

export default PrimaryButton;
