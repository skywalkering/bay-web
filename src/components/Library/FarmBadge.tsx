type FarmBadgeProps = {
  type: "standard" | "stable" | "single";
};

export default function FarmBadge({ type }: FarmBadgeProps) {
  return (
    <div className="flex px-3 py-1 bg-bodyGray rounded-[4px] w-max dark:bg-[#001942]">
      <span className="font-bold font-montserrat text-[10px] tracking-[0.36em] text-primaryBlue dark:text-white uppercase">
        {type} {type == "single" ? " stacking" : " swap"}
      </span>
    </div>
  );
}
