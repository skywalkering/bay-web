import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Button from "@components/Library/Button";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [darkSide, setDarkSide] = useState(false);

  useEffect(() => {
    setDarkSide(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return (
    <div className="relative flex items-center justify-between w-full px-9 sm:px-11 lg:px-[120px] pt-8 sm:pt-12 pb-8 z-10 font-medium text-sm md:text-base text-neutral-800 dark:text-white transition duration-200">
      <div className="flex flex-col items-center cursor-pointer">
        <span className="font-bold font-spaceGrotesk text-white text-lg leading-[23px] sm:text-2xl sm:leading-8">
          yieldbay
        </span>
        <div className="flex bg-white dark:bg-primaryBlue rounded-[10px] -mt-0.5 px-[11px] sm:px-[14px] py-[3px] text-primaryBlue dark:text-white text-[8px] leading-[10px] sm:text-sm sm:leading-[17px] font-bold tracking-[0.46em] uppercase transition duration-200">
          <span className="-mr-1">List</span>
        </div>
      </div>
      <div className="inline-flex items-center gap-x-4 sm:mr-2">
        <a
          href="https://discord.gg/AKHuvbz7q4"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:block"
        >
          <Button type="primary" size="small">
            List your protocol
          </Button>
        </a>
        <DarkModeSwitch
          checked={darkSide}
          onChange={(checked) => setTheme(checked ? "dark" : "light")}
          size={24}
          moonColor="white"
          sunColor="white"
        />
      </div>
    </div>
  );
}
