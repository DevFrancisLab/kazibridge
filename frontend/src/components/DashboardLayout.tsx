import {
  Home,
  PieChart,
  Users,
  Settings,
  Inbox,
  Bell,
  Menu,
  LogOut,
} from "lucide-react";
import { Briefcase, Clock, CheckCircle2, DollarSign } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: Home },
  { label: "Analytics", icon: PieChart },
  { label: "Team", icon: Users },
  { label: "Messages", icon: Inbox },
  { label: "Settings", icon: Settings },
];

export const DashboardSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 overflow-y-auto border-r border-gray-200 bg-white px-4 py-6 transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-slate-900 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
      style={{ height: "100vh" }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">KaziBridge</h1>
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 md:hidden dark:bg-slate-800 dark:text-gray-100"
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-gray-200 pt-5 dark:border-gray-700">
        <a
          href="#"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </a>
      </div>
    </aside>
  );
};

export const DashboardTopbar = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 md:hidden dark:bg-slate-800 dark:text-gray-100"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-black dark:text-white">Overview</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-lg bg-gray-100 p-2 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-100" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm dark:border-gray-700 dark:bg-slate-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-1" />
          <div>
            <p className="text-sm font-semibold text-black dark:text-white">Jane Doe</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">Product Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export const DashboardContent = () => {
  return (
    <main className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-black dark:text-white">Summary</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Active Jobs",
              value: "24",
              icon: Briefcase,
              iconColor: "text-blue-500",
            },
            {
              title: "Pending Payments",
              value: "8",
              icon: Clock,
              iconColor: "text-amber-500",
            },
            {
              title: "Completed Jobs",
              value: "126",
              icon: CheckCircle2,
              iconColor: "text-slate-600",
            },
            {
              title: "Total Spent",
              value: "$14.2K",
              icon: DollarSign,
              iconColor: "text-indigo-500",
            },
          ].map((card) => {
            const CardIcon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-slate-800"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">{card.title}</p>
                  <div className={`rounded-md bg-gray-100 p-2 ${card.iconColor}`}>
                    <CardIcon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-4 text-3xl font-bold text-black dark:text-white">{card.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-black dark:text-white">My Jobs</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "Mobile App UI Design",
              budget: "120,000",
              status: "Open",
              bids: 14,
            },
            {
              title: "React E-commerce Website",
              budget: "250,000",
              status: "In Progress",
              bids: 21,
            },
            {
              title: "SEO Content Writing",
              budget: "45,000",
              status: "Completed",
              bids: 9,
            },
          ].map((job) => (
            <article
              key={job.title}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-slate-800"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">{job.title}</h4>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    job.status === "Open"
                      ? "bg-sky-100 text-sky-700"
                      : job.status === "In Progress"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <p className="mb-2 text-sm text-slate-500 dark:text-gray-300">Budget: KES {job.budget}</p>
              <p className="mb-4 text-sm text-slate-500 dark:text-gray-300">Bids: {job.bids}</p>

              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:opacity-90" style={{ backgroundColor: '#70e000' }}>
                  View Bids
                </button>
                <button className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:hover:bg-slate-800">
                  Edit Job
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

const DashboardLayout = () => {
  return (
    <div className="min-h-screen font-sans text-black dark:bg-slate-950 dark:text-white">
      <DashboardTopbar onOpenSidebar={() => {}} />

      <div className="h-[calc(100vh-4rem)] overflow-y-auto p-0 md:p-4 scrollbar-hide">
        <div className="mx-auto w-full max-w-7xl px-0 md:px-4">
          <DashboardContent />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
