import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router";

export function UserMenu() {
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
        <DropdownMenuLinkItem render={<Link to={"/login"} />}>
          Log in
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link to={"/account"} />}>
          Account
        </DropdownMenuLinkItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
