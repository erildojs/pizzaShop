import { Link, useLocation, type LinkProps } from "react-router";

export type NavLinkProps = LinkProps

export function NavLink(props: NavLinkProps) {
  const {pathname} = useLocation() //useLocation retorna infos da rota
  return (
    <Link 
    data-current={pathname === props.to}
    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground
      data-[current=true]:text-foreground
    " {...props}
    
    />
  )
}

//props.to - endereço para onde o link vai