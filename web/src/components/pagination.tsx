import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";

export interface paginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
}
export function Pagination({pageIndex, totalCount, perPage}: paginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Total de {totalCount} iten(s)
      </span>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium">
          Página {pageIndex + 1} de {pages}
        </div>
        <div className="flex items-center gap-2">
        <Button className="h-8 w-8 p-0" variant="outline">
          <ChevronsLeft className="h-4 w-4"/>
          <span className="sr-only">Primeira página</span>
        </Button>
        <Button className="h-8 w-8 p-0" variant="outline">
          <ChevronLeft className="h-4 w-4"/>
          <span className="sr-only">Página anterior</span>
        </Button>
        <Button className="h-8 w-8 p-0" variant="outline">
          <ChevronRight className="h-4 w-4"/>
          <span className="sr-only">Próxima página</span>
        </Button>
        <Button className="h-8 w-8 p-0" variant="outline">
          <ChevronsRight className="h-4 w-4"/>
          <span className="sr-only">Última página</span>{/** span so para seo */}
        </Button>
        </div>
      </div>
    </div>
  )
}