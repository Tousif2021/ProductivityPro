import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/ui/sidebar";
import { FiCalendar, FiFolder, FiBell } from "react-icons/fi";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: FiCalendar, label: "Tasks" },
    { href: "/media", icon: FiFolder, label: "Media" },
    { href: "/reminders", icon: FiBell, label: "Reminders" },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Productivity Suite</h2>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <a
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                      location === link.href ? "bg-gray-100 text-gray-900" : ""
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </Sidebar>
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
    </div>
  );
}
