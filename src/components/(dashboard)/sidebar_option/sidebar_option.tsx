type Props = {
  title: string;
  selected: boolean;
  SelectedIcon: any;
  Icon: any;
  onClick?: () => void;
};

const SidebarOption = ({
  title,
  selected,
  Icon,
  SelectedIcon,
  onClick,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className={`p-1 lg:px-5 lg:py-2 gap-x-2 rounded-lg flex items-center duration-150 cursor-pointer mb-2 text-gray-500 ${
        selected ? "bg-accent text-white" : "hover:bg-slate-100"
      }`}
    >
      {selected ? (
        <SelectedIcon className="h-6 object-contain" />
      ) : (
        <Icon className="h-6 object-contain" />
      )}
      <h3 className="hidden md:block font-medium ">{title}</h3>
    </div>
  );
};

export default SidebarOption;
