import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { HiOutlineMenuAlt4 } from "react-icons/hi";

export function HeaderSheet() {
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
          <div className="grid grid-cols-1 gap-y-2">

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
