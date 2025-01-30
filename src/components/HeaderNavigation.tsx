import type { CollectionEntry } from "astro:content";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn, isPathMatching } from "@/lib/utils";

export function HeaderNavigation({ navigation, currentPath }: { navigation: Array<CollectionEntry<"navigation">>; currentPath: string; }) {

  function customNavigationMenuTriggerStyle({ targetPath, strict = false }: { targetPath: string; strict?: boolean }) {
    return cn(
      navigationMenuTriggerStyle(),
      isPathMatching(currentPath, targetPath, strict) && "bg-secondary text-secondary-foreground font-bold"
    )
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className={customNavigationMenuTriggerStyle({ targetPath: "/", strict: true })}>ホーム</NavigationMenuLink>
        </NavigationMenuItem>
        {navigation.map((item, index) => item.data.children ?
          <NavigationMenuItem key={index}>
            <NavigationMenuTrigger>{item.data.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[500px] grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink href={item.data.path} className={cn(customNavigationMenuTriggerStyle({ targetPath: item.data.path, strict: true }), "w-full h-full flex flex-col justify-end items-start")}>
                    <div className="mb-2 mt-4 text-base">
                      {item.data.title}
                    </div>
                    <p className="text-[0.75rem] leading-tight text-muted-foreground">
                      {item.data.description}
                    </p>
                  </NavigationMenuLink>
                </li>
                {item.data.children.map((child, childIndex) => (
                  <li key={childIndex} className="w-full">
                    <NavigationMenuLink key={childIndex} href={child.path} className={cn(customNavigationMenuTriggerStyle({ targetPath: child.path, strict: true }), "w-full justify-start")}>{child.title}</NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          :
          <NavigationMenuItem key={index}>
            <NavigationMenuLink href={item.data.path} className={customNavigationMenuTriggerStyle({ targetPath: item.data.path, strict: true })}>{item.data.title}</NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
