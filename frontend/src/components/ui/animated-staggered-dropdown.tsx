import { Dispatch, SetStateAction, useState } from "react";
import { FiChevronDown, FiEdit, FiPlusSquare, FiShare, FiTrash } from "react-icons/fi";
import { IconType } from "react-icons";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type DropdownOption = {
  text: string;
  Icon: IconType;
  onSelect?: () => void;
  className?: string;
  iconClassName?: string;
};

type StaggeredDropDownProps = {
  label?: string;
  options?: DropdownOption[];
  buttonClassName?: string;
  menuClassName?: string;
};

const defaultOptions: DropdownOption[] = [
  { Icon: FiEdit, text: "Edit" },
  { Icon: FiPlusSquare, text: "Duplicate" },
  { Icon: FiShare, text: "Share" },
  { Icon: FiTrash, text: "Remove" },
];

const StaggeredDropDown = ({
  label = "Post actions",
  options = defaultOptions,
  buttonClassName,
  menuClassName,
}: StaggeredDropDownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          type="button"
          onClick={() => setOpen((pv) => !pv)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-extrabold text-black transition hover:bg-white/55",
            buttonClassName,
          )}
        >
          <span>{label}</span>
          <motion.span variants={iconVariants}>
            <FiChevronDown />
          </motion.span>
        </button>

        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: "top", translateX: "-50%" }}
          className={cn(
            "absolute left-1/2 top-[120%] z-50 flex w-64 flex-col gap-1.5 overflow-hidden rounded-lg border border-border bg-white p-2 shadow-xl",
            menuClassName,
          )}
        >
          {options.map((option) => (
            <Option key={option.text} setOpen={setOpen} {...option} />
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
};

const Option = ({
  text,
  Icon,
  setOpen,
  onSelect,
  className,
  iconClassName,
}: DropdownOption & { setOpen: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => {
        onSelect?.();
        setOpen(false);
      }}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 whitespace-nowrap rounded-md p-2.5 text-sm font-bold text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700",
        className,
      )}
    >
      <motion.span variants={actionIconVariants} className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50">
        <Icon className={cn("h-4 w-4", iconClassName)} />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

export default StaggeredDropDown;

const wrapperVariants: Variants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants: Variants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants: Variants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
