"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  sideNavigationMenuTriggerStyle
} from "./ui/navigation-menu";

const MainNavigation = () => {
  return (
    <NavigationMenu className="flex flex-col justify-start h-full">
      <NavigationMenuList className="flex flex-col w-[300px] h-full space-x-0 overflow-y-auto">
        <NavigationMenuItem className="w-full p-1">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={sideNavigationMenuTriggerStyle()}>
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full p-1">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={sideNavigationMenuTriggerStyle()}>
              Users
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full p-1">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={sideNavigationMenuTriggerStyle()}>
              Documents
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full p-1">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={sideNavigationMenuTriggerStyle()}>
              Archives
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full p-1">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={sideNavigationMenuTriggerStyle()}>
              Announcements
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full p-1">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={sideNavigationMenuTriggerStyle()}>
              Surveys
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="w-full p-1">
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={sideNavigationMenuTriggerStyle()}>
              Export Data
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
