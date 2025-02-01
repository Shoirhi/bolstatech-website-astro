import {
  Pagination as CnPagination,
  PaginationContent as CnPaginationContent,
  PaginationItem as CnPaginationItem,
  PaginationLink as CnPaginationLink,
} from "@/components/ui/pagination"

import {
  LuChevronFirst,
  LuChevronLeft,
  LuChevronRight,
  LuChevronLast,
} from "react-icons/lu";

export function Pagination({ currentPage, lastPage, url, basePath, categoryId }: {
  currentPage: number;
  lastPage: number;
  url: {
    next?: string;
    prev?: string;
    first?: string;
    last?: string;
  },
  basePath: string;
  categoryId?: string;
}) {

  return (
    <CnPagination>
      <CnPaginationContent className="grid grid-cols-[1fr_1fr_auto_1fr_1fr]">
        {
          url.first && (
            <CnPaginationItem className="col-start-1">
              <CnPaginationLink
                aria-label="最初のページへ"
                size="icon"
                href={url.first}
              >
                <LuChevronFirst className="w-5 h-5" />
                <span className="sr-only">最初のページへ</span>
              </CnPaginationLink>
            </CnPaginationItem>
          )
        }
        {
          url.prev && (
            <CnPaginationItem className="col-start-2">
              <CnPaginationLink aria-label="前のページへ" size="icon" href={url.prev}>
                <LuChevronLeft className="w-5 h-5" />
                <span className="sr-only">前のページへ</span>
              </CnPaginationLink>
            </CnPaginationItem>
          )
        }
        <CnPaginationItem className="px-4 col-start-3">
          {currentPage} / {lastPage}
        </CnPaginationItem>
        {
          url.next && (
            <CnPaginationItem className="col-start-4">
              <CnPaginationLink aria-label="次のページへ" size="icon" href={url.next}>
                <LuChevronRight className="w-5 h-5" />
                <span className="sr-only">次のページへ</span>
              </CnPaginationLink>
            </CnPaginationItem>
          )
        }
        {
          url.last && (
            <CnPaginationItem className="col-start-5">
              <CnPaginationLink
                aria-label="最後のページへ"
                size="icon"
                href={url.last}
              >
                <LuChevronLast className="w-5 h-5" />
                <span className="sr-only">最後のページへ</span>
              </CnPaginationLink>
            </CnPaginationItem>
          )
        }
      </CnPaginationContent>
    </CnPagination>
  )
}