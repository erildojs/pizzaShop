import { Home, Pizza } from "lucide-react";
import { Separator } from "./ui/separator";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme/theme-toggle";
import { AccontMenu } from "./account-menu";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex items-center h-16 gap-6 px-6">
        <Pizza className="h-6 w-6" />
        <Separator className="h-6" orientation="vertical" />

        <nav className="items-center flex space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-4 w-4"/>
            Início
          </NavLink>
          <NavLink to="/orders">
            <Home className="h-4 w-4"/>
            Pedidos
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <AccontMenu />
        </div>
      </div>
    </div>
  )
}