import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

export function OrderTableFilters() {
  return (
    <form className="flex gap-2 items-center">
        <span className="text-sm font-semibold">Filtros:</span>
        <Input type="text" placeholder="ID do pedido" className="h-8 w-auto"/>
        <Input type="text" placeholder="Nome do cliente" className="h-8 w-[320px]"/>
        <Select defaultValue="all">
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="peding">Pendente</SelectItem>
            <SelectItem value="canceled">Cancelado</SelectItem>
            <SelectItem value="processing">Em preparo</SelectItem>
            <SelectItem value="delivering">Em entrega</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" type="submit" size="sm">
          <Search className="mr-2 h-4 w-4"/>
          Filtrar resultados
        </Button>
        <Button variant="outline" type="button" size="sm">
          <X className="mr-2 h-4 w-4"/>
          Remover filtros
        </Button>
    </form>
  )
}