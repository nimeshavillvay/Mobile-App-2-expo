import Menu from "@repo/web-ui/components/icons/menu";
import Profile from "@repo/web-ui/components/icons/profile";
import ShoppingCart from "@repo/web-ui/components/icons/shopping-cart";
import WurthFullBlack from "@repo/web-ui/components/logos/wurth-full-black";
import {
  SearchBox,
  SearchBoxButton,
  SearchBoxInput,
} from "@repo/web-ui/components/search-box";
import { Button } from "@repo/web-ui/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex flex-col gap-4 border-b border-b-wurth-gray-250 py-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.05),0px_1px_2px_-1px_rgba(0,0,0,0.05)]">
      <div className="container flex w-full flex-row items-center gap-7">
        <Button
          variant="ghost"
          size="icon"
          className="size-6 flex-shrink-0 md:hidden"
        >
          <Menu />

          <span className="sr-only">Menu</span>
        </Button>

        <Link href="/" className="flex-shrink-0">
          <WurthFullBlack className="h-[24px] w-[114px] md:h-[28px] md:w-[133px]" />

          <span className="sr-only">Home</span>
        </Link>

        <SearchBox className="mx-auto hidden min-w-0 max-w-[35rem] flex-1 md:flex">
          <SearchBoxInput placeholder="What are you looking for?" />

          <SearchBoxButton />
        </SearchBox>

        <div className="ml-auto flex flex-row items-center gap-4 md:ml-0 md:gap-6">
          {/* Mobile */}
          <Button variant="ghost" size="icon" className="size-6 md:hidden">
            <Profile />

            <span className="sr-only">User Profile</span>
          </Button>

          <Button variant="ghost" size="icon" className="size-6 md:hidden">
            <ShoppingCart />

            <span className="sr-only">Shopping Cart</span>
          </Button>

          {/* Desktop */}
          <Button
            variant="ghost"
            className="hidden shrink-0 md:flex md:h-min md:flex-row md:items-center md:gap-2 md:p-0"
          >
            <Profile className="size-7" />

            <span className="text-base font-semibold">Sign in / Register</span>
          </Button>

          <Button
            variant="ghost"
            className="hidden shrink-0 md:flex md:h-min md:flex-row md:items-center md:gap-2 md:p-0"
          >
            <ShoppingCart className="size-7" />

            <span className="text-base font-semibold">Cart</span>
          </Button>
        </div>
      </div>

      <div className="container w-full md:hidden">
        <SearchBox>
          <SearchBoxInput placeholder="What are you looking for?" />

          <SearchBoxButton />
        </SearchBox>
      </div>
    </header>
  );
};

export default Header;
