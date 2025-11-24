import { PanelLeft } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export const Header = ({onOpenSidebar} : HeaderProps) => {
  return (
    <>
      <header className="flex items-center justify-between px-2 sm:px-4 py-2 bg-background text-black dark:text-white w-full">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={onOpenSidebar}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
};