import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  CalendarDays, 
  FolderOpen, 
  Bell,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: CalendarDays, label: "Tasks" },
    { href: "/media", icon: FolderOpen, label: "Media" },
    { href: "/reminders", icon: Bell, label: "Reminders" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Content with animation */}
      <motion.main 
        className="flex-1 overflow-y-auto p-4 pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <a className="flex flex-col items-center py-2">
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-colors duration-200",
                      isActive ? "text-blue-500" : "text-gray-400"
                    )} 
                  />
                  <span className={cn(
                    "text-xs mt-1 transition-colors duration-200",
                    isActive ? "text-blue-500" : "text-gray-500"
                  )}>
                    {link.label}
                  </span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}