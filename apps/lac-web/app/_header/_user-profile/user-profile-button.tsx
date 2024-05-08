"use client";

import useSuspenseCheckLogin from "@/_hooks/user/use-suspense-check-login.hook";
import useSuspenseUsersList from "@/_hooks/user/use-suspense-users-list.hook";
import { Exit } from "@repo/web-ui/components/icons/exit";
import { HeartOutline } from "@repo/web-ui/components/icons/heart-outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@repo/web-ui/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ButtonContent, { buttonClasses } from "./button-content";
import type { ViewportTypes } from "./types";
import useLogoutMutation from "./use-logout-mutation.hook";

const UserProfileButton = ({
  token,
  type,
}: {
  token: string;
  type: ViewportTypes;
}) => {
  const checkLoginQuery = useSuspenseCheckLogin(token);

  // User isn't logged in
  if (checkLoginQuery.data.status_code === "NOT_LOGGED_IN") {
    return (
      <Link
        href="/sign-in"
        className={buttonClasses({
          variant: "ghost",
          size: type === "mobile" ? "icon" : "default",
          type,
        })}
      >
        <ButtonContent />
      </Link>
    );
  }

  return <UserProfileDropdown token={token} type={type} />;
};

export default UserProfileButton;

const UserProfileDropdown = ({
  token,
  type,
}: {
  token: string;
  type: ViewportTypes;
}) => {
  const usersListQuery = useSuspenseUsersList(token);
  const userProfile = usersListQuery.data.manageContact.yourProfile;

  const logoutMutation = useLogoutMutation();

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonClasses({
          variant: "ghost",
          size: type === "mobile" ? "icon" : "default",
          type,
        })}
      >
        <ButtonContent>
          Hi, {userProfile.firstName !== "" ? userProfile.firstName : "User"}
        </ButtonContent>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          className="flex flex-row items-center gap-2 text-black"
          onClick={() => router.push("/myaccount/orderhistory")}
        >
          <DropdownMenuShortcut className="ml-0">
            {/* To fill the icon gap */}
            <div className="size-4" />
          </DropdownMenuShortcut>

          <span>My Orders</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex flex-row items-center gap-2 text-black"
          onClick={() => router.push("/myaccount/purchaseditems")}
        >
          <DropdownMenuShortcut className="ml-0">
            {/* To fill the icon gap */}
            <div className="size-4" />
          </DropdownMenuShortcut>

          <span>My Purchased Items</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex flex-row items-center gap-2 text-black"
          onClick={() => router.push("/myaccount/myfavorites")}
        >
          <DropdownMenuShortcut className="ml-0">
            <HeartOutline className="size-4 stroke-black stroke-2" />
          </DropdownMenuShortcut>

          <span>My Favorites</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex flex-row items-center gap-2 text-wurth-red-650"
          onClick={() => logoutMutation.mutate()}
        >
          <DropdownMenuShortcut className="ml-0">
            <Exit className="size-4 stroke-wurth-red-650 stroke-2" />
          </DropdownMenuShortcut>

          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
