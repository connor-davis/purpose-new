"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  sideNavigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  return (
    <NavigationMenu className="flex flex-col">
      <NavigationMenuList className="flex flex-col w-[300px] h-full space-x-0 overflow-y-auto">
        <NavigationMenuItem className="w-full p-1">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={sideNavigationMenuTriggerStyle()}>
              Logout
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default BottomNavigation;
