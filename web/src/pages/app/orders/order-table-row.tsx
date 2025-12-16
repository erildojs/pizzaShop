import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, Search } from "lucide-react";
import { OrderDetails } from "./order-details";

export function OrderTableRow() {
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Search className="w-3 h-3"/>
                <span className="sr-only">Detalhes do pedido</span>
              </Button>
          </DialogTrigger>
          <OrderDetails />
        </Dialog>
            </TableCell>
            <TableCell className="font-mono text-xs font-medium">
              5382958735728954829647
            </TableCell>
            <TableCell className="text-muted-foreground">
              há 15 minutos
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span className="font-medium text-muted-foreground">
                  Pendente
                </span>
              </div>
            </TableCell>
            <TableCell className="font-medium">Erildo</TableCell>
            <TableCell className="font-medium">
              Kz 15.000,00
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                <ArrowRight className="mr-2 h-3 w-3" />
                Aprovar
              </Button>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                <ArrowRight className="mr-2 h-3 w-3" />
                Aprovar
              </Button>
            </TableCell>
    </TableRow>
  )
}