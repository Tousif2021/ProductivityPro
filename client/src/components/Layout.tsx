import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  CheckSquare2, 
  FolderHeart,
  Bell
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: CheckSquare2, label: "Tasks" },
    { href: "/media", icon: FolderHeart, label: "Media" },
    { href: "/reminders", icon: Bell, label: "Reminders" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Main Content with animation */}
      <motion.main 
        className="flex-1 overflow-y-auto pb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 backdrop-blur-lg bg-opacity-80 px-4 py-2 shadow-lg">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;

            return (
              <Link key={link.href} href={link.href}>
                <motion.a 
                  className="flex flex-col items-center py-2 px-4 relative"
                  whileTap={{ scale: 0.95 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navigation-pill"
                      className="absolute inset-0 bg-indigo-50 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon 
                    className={cn(
                      "w-6 h-6 relative transition-colors duration-200",
                      isActive ? "text-indigo-600" : "text-gray-400"
                    )} 
                  />
                  <span className={cn(
                    "text-xs mt-1 relative transition-colors duration-200",
                    isActive ? "text-indigo-600 font-medium" : "text-gray-500"
                  )}>
                    {link.label}
                  </span>
                </motion.a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}