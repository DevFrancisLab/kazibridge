import {
  Home,
  Users,
  Bell,
  Menu,
  LogOut,
} from "lucide-react";
import { Briefcase, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: Home, to: "/dashboard" },
  { label: "Find Jobs", icon: Briefcase, to: "/jobs" },
  { label: "My Tasks", icon: Clock, to: "/tasks" },
  { label: "Earnings", icon: DollarSign, to: "/earnings" },
  { label: "Profile", icon: Users, to: "/profile" },
];

export const DashboardSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto border-r border-gray-200 bg-white px-4 py-6 transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-slate-900 ${
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
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gray-100 text-black border-l-4 border-black'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-200 pt-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Jane Doe</p>
              <p className="text-xs text-gray-500">Freelancer</p>
            </div>
          </div>
          <button className="mt-4 w-full rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
            View Profile
          </button>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <LogOut className="h-4 w-4" /> Logout
        </button>
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
  const role = localStorage.getItem('role');

  return (
    <main className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-black dark:text-white">Summary</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Total Earnings",
              value: "$18,720",
              icon: DollarSign,
              iconColor: "text-green-500",
            },
            {
              title: "Active Jobs",
              value: "12",
              icon: Briefcase,
              iconColor: "text-blue-500",
            },
            {
              title: "Pending Payments",
              value: "4",
              icon: Clock,
              iconColor: "text-amber-500",
            },
            {
              title: "Workload Status",
              value: "Busy",
              icon: CheckCircle2,
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

      {role === 'CLIENT' && (
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
      )}

      {role === 'FREELANCER' && (
        <>
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">My Tasks</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Prioritize your work</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Design mobile app UI',
                  client: 'Acme Co',
                  deadline: 'Apr 25',
                  priority: 'High',
                },
                {
                  title: 'Write SEO content',
                  client: 'Marketify',
                  deadline: 'Apr 28',
                  priority: 'Medium',
                },
                {
                  title: 'Fix dashboard bugs',
                  client: 'KaziBridge',
                  deadline: 'Apr 30',
                  priority: 'Low',
                },
              ].map((task) => {
                const priorityClasses =
                  task.priority === 'High'
                    ? 'bg-rose-100 text-rose-700'
                    : task.priority === 'Medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700';

                return (
                  <article
                    key={task.title}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-slate-800"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Client: {task.client}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Deadline: {task.deadline}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityClasses}`}>
                        {task.priority}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black dark:text-white">Find Jobs</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Bid on projects matched to your skills</span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'E-commerce Website Redesign',
                  budget: '350,000',
                  deadline: 'Apr 28',
                  recommended: true,
                },
                {
                  title: 'Mobile App MVP (React Native)',
                  budget: '420,000',
                  deadline: 'May 6',
                  recommended: false,
                },
                {
                  title: 'SEO + Content Strategy',
                  budget: '95,000',
                  deadline: 'Apr 30',
                  recommended: true,
                },
              ].map((job) => (
                <article
                  key={job.title}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-slate-800"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">{job.title}</h4>
                    {job.recommended ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                        Recommended
                      </span>
                    ) : null}
                  </div>

                  <p className="mb-1 text-sm text-slate-500 dark:text-gray-300">Budget: KES {job.budget}</p>
                  <p className="mb-4 text-sm text-slate-500 dark:text-gray-300">Deadline: {job.deadline}</p>

                  <button className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Place Bid
                  </button>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black dark:text-white">Earnings</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Track your income</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300">Total Earnings</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">KES 1,250,000</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300">This Month</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">KES 120,000</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300">Pending Balance</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">KES 28,000</p>
          </div>
        </div>

        <div className="mt-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Payments</h4>
          <ul className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700">
            {[
              { label: 'Logo design (Acme Corp)', amount: 'KES 45,000', date: 'Mar 22' },
              { label: 'Landing page development', amount: 'KES 80,000', date: 'Mar 18' },
              { label: 'SEO content package', amount: 'KES 30,000', date: 'Mar 15' },
            ].map((payment) => (
              <li
                key={payment.label}
                className="flex items-center justify-between rounded-lg p-3 text-sm transition hover:bg-gray-50 dark:hover:bg-slate-900"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{payment.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{payment.date}</p>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{payment.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black">KaziLink AI Assistant</h3>
          <span className="text-xs text-gray-500">Smart suggestions</span>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-gray-50 p-4 shadow-xs">
            <p className="text-sm font-medium text-gray-700">Task priority recommendation</p>
            <p className="mt-1 text-sm text-gray-600">Focus on Logo Design (due tomorrow)</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 shadow-xs">
            <p className="text-sm font-medium text-gray-700">Workload warning</p>
            <p className="mt-1 text-sm text-gray-600">You have 3 deadlines this week</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 shadow-xs">
            <p className="text-sm font-medium text-gray-700">Productivity tip</p>
            <p className="mt-1 text-sm text-gray-600">Complete 2 tasks today</p>
          </div>
        </div>
      </section>
    </main>
  );
};

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-black dark:bg-slate-950 dark:text-white">
      <DashboardTopbar onOpenSidebar={() => {}} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="h-full">
          <div className="mx-auto w-full max-w-7xl px-0 md:px-4 p-0 md:p-4">
            <DashboardContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
