import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

interface NavItem {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/student", label: "Student" },
  { href: "/scanner", label: "Scanner" },
]

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-foreground">
              Presence
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="flex space-x-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Navigation */}
          <div className="flex md:hidden">
            <MobileNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  )
}

// Mobile Navigation Component
function MobileNav({ items }: { items: NavItem[] }) {
  return (
    <div className="flex flex-col space-y-2">
      {items.map((item) => (
        <Button key={item.href} variant="ghost" asChild className="justify-start">
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </div>
  )
}
