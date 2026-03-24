import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Briefcase,
  Users,
  CreditCard,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { logoutUser } from "@/lib/auth";

interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
}

const navItems: Array<{ path: string; label: string; icon: React.ElementType }> = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/jobs", label: "My Jobs", icon: Briefcase },
  { path: "/jobs/1", label: "Freelancers", icon: Users },
  { path: "/payments", label: "Payments", icon: CreditCard },
  { path: "/messages", label: "Messages", icon: MessageCircle },
];

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[250px] border-r border-gray-200 bg-white px-4 py-6 shadow-sm">
      <div className="mb-8 flex items-center gap-2 border-b border-gray-100 pb-5">
        <div className="h-9 w-9 rounded-md bg-gradient-to-br from-blue-600 to-cyan-500" />
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">KaziBridge</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                  isActive ? "bg-gray-100 font-semibold text-slate-900" : "text-slate-600 hover:bg-gray-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
          <div className="h-9 w-9 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Alex Johnson</p>
            <p className="text-xs text-slate-500">Client</p>
          </div>
        </div>

        <button
          onClick={async () => {
            await logoutUser();
            navigate('/login');
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-gray-100 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
