import { LogOutIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router";
import { selectIsLoggedIn, useAuthStore } from "@/features/auth/authStore";
import { useLogout } from "@/features/auth/useLogout";

export function UserMenu() {
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Account menu" />
        }
      >
        <UserIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={"w-40"}>
        {isLoggedIn ? (
          <>
            <DropdownMenuLinkItem render={<Link to={"/account"} />}>
              Account
            </DropdownMenuLinkItem>
            <DropdownMenuItem onClick={logout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuLinkItem render={<Link to={"/login"} />}>
            Log in
          </DropdownMenuLinkItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
