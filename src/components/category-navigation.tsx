import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

export function CategoryNavigation({ basePath, categories, currentCategory }: {
  basePath: string;
  categories: Array<{
    id: string
    data: {
      title: string
    }
  }>;
  currentCategory?: {
    id: string
    data: {
      title: string
    }
  }
}) {

  const currentCategoryStyle = "font-bold bg-secondary";

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap justify-start space-x-0 gap-2">
        <NavigationMenuItem>
          <NavigationMenuLink
            href={`${basePath}`}
            className={cn(navigationMenuTriggerStyle(), !currentCategory && currentCategoryStyle)}>すべて</NavigationMenuLink
          >
        </NavigationMenuItem>
        {
          categories.map((category) => (
            <NavigationMenuItem>
              <NavigationMenuLink
                href={`${basePath}${category.id}`}
                className={cn(navigationMenuTriggerStyle(), currentCategory?.id === category.id && currentCategoryStyle)}
              >
                {category.data.title}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))
        }
      </NavigationMenuList>
    </NavigationMenu>
  )
}