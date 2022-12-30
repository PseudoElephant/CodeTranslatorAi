import { DashboardIcon, MoonIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";

/* Components */
import Logo from "./components/logo";
import Button from "../../common/components/button";

const Navbar = () => {
  return (
    <nav className="grid grid-cols-3 bg-neutral-1 py-4 px-8 items-center shadow-sm shadow-neutral-4">
      <div className="flex items-center justify-self-start gap-2">
        <Logo />
        <h1 className="font-bold">Code Translater AI</h1>
      </div>
      <div className="flex items-center justify-self-center gap-4">
        <Link href="/" className="flex items-center gap-1 text-primary-11">
          <DashboardIcon width={20} height={20} />
          <h2 className="text-neutral-12">Translator</h2>
        </Link>
        <Link
          href="/pricing"
          className="flex items-center gap-1 text-primary-11"
        >
          <PersonIcon width={20} height={20} />
          <h2 className="text-neutral-12">Pricing</h2>
        </Link>
      </div>
      <div className="flex items-center gap-4 justify-self-end">
        <Button link="login">Login</Button>
        <MoonIcon width={20} height={20} />
      </div>
    </nav>
  );
};

export default Navbar;
