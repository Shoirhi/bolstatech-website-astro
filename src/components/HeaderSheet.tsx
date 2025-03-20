import type { CollectionEntry } from "astro:content";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn, isPathMatching } from "@/lib/utils";

import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";

export function HeaderSheet({ navigation, currentPath }: { navigation: Array<CollectionEntry<"navigation">>; currentPath: string; }) {

  function CustomNavigationMenuItem({ href, title, strict }: { href: string; title: string; strict?: boolean }) {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink href={href} className={customNavigationMenuTriggerStyle({ targetPath: href, strict: strict })}>{title}</NavigationMenuLink>
      </NavigationMenuItem>
    )
  }

  function customNavigationMenuTriggerStyle({ targetPath, strict = false }: { targetPath: string; strict?: boolean }) {
    return cn(
      navigationMenuTriggerStyle(),
      "w-full justify-between",
      isPathMatching(currentPath, targetPath, strict) && "bg-secondary text-secondary-foreground font-bold"
    )
  }

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
        <HiOutlineMenuAlt4 />
        <span className="sr-only">メニューを開く</span>
      </SheetTrigger>
      <SheetContent className="grid grid-rows-[auto_1fr]">
        <SheetHeader>
          <SheetTitle className="sr-only">メニュー</SheetTitle>
          <SheetDescription className="sr-only">
            このWebサイトのメニューです。
          </SheetDescription>
        </SheetHeader>
        <ScrollArea>
          <NavigationMenu orientation="vertical" className="max-w-none [&>div]:flex-1">
            <NavigationMenuList className="flex-col items-stretch space-x-0 space-y-2">
              <CustomNavigationMenuItem href="/" title="ホーム" strict />
              {navigation.map((item, index) => item.data.children ?
                <NavigationMenuItem key={index}>
                  <Collapsible defaultOpen={isPathMatching(currentPath, item.data.path)}>
                    <CollapsibleTrigger className={cn(customNavigationMenuTriggerStyle({ targetPath: item.data.path }), "data-active:bg-inherit")}>
                      {item.data.title}<IoIosArrowForward className="w-3 h-3 group-data-[state=open]:rotate-90 duration-150" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 CollapsibleContent">
                      <NavigationMenuList className="pt-2 flex-col items-stretch space-x-0 space-y-2 border-l pl-1.5">
                        <CustomNavigationMenuItem href={item.data.path} title={item.data.title} strict />
                        {item.data.children.map((child, childIndex) => (
                          <CustomNavigationMenuItem key={childIndex} href={child.path} title={child.title} strict />
                        ))}
                      </NavigationMenuList>
                    </CollapsibleContent>
                  </Collapsible>
                </NavigationMenuItem>
                :
                <CustomNavigationMenuItem key={index} href={item.data.path} title={item.data.title} />
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}