import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Users, CheckSquare, FileText } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/students", icon: Users, label: "Students" },
    { to: "/attendance", icon: CheckSquare, label: "Mark Attendance" },
    { to: "/reports", icon: FileText, label: "Reports" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Attendance Monitor</h1>
            </div>
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
