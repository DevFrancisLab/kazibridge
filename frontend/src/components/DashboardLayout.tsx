import {
  Home,
  Users,
  Bell,
  Menu,
  LogOut,
} from "lucide-react";
import { Briefcase, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { getJobs, getTasks, getEarnings } from "../lib/auth";

interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  created_at: string;
  updated_at: string;
  client: {
    id: number;
    email: string;
    role: string;
  };
  freelancer?: {
    id: number;
    email: string;
    role: string;
  };
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  job: Job;
  freelancer: {
    id: number;
    email: string;
    role: string;
  };
}

interface Earnings {
  id: number;
  amount: number;
  earned_at: string;
  job: Job;
  freelancer: {
    id: number;
    email: string;
    role: string;
  };
}

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [earnings, setEarnings] = useState<Earnings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (role === 'CLIENT') {
          const jobsResponse = await getJobs();
          if (jobsResponse.success) {
            setJobs(jobsResponse.data || []);
          }
        } else if (role === 'FREELANCER') {
          const [tasksResponse, earningsResponse] = await Promise.all([
            getTasks(),
            getEarnings()
          ]);
          if (tasksResponse.success) {
            setTasks(tasksResponse.data || []);
          }
          if (earningsResponse.success) {
            setEarnings(earningsResponse.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  if (loading) {
    return (
      <main className="space-y-6 p-4 md:p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

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
            {jobs.length > 0 ? jobs.map((job: Job) => (
              <article
                key={job.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-slate-800"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">{job.title}</h4>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      job.status === "OPEN"
                        ? "bg-sky-100 text-sky-700"
                        : job.status === "IN_PROGRESS"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="mb-2 text-sm text-slate-500 dark:text-gray-300">Budget: KES {job.budget}</p>
                <p className="mb-4 text-sm text-slate-500 dark:text-gray-300">Description: {job.description.substring(0, 100)}...</p>

                <div className="flex flex-wrap gap-2">
                  <button className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:opacity-90" style={{ backgroundColor: '#70e000' }}>
                    View Details
                  </button>
                  <button className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100 dark:hover:bg-slate-800">
                    Edit Job
                  </button>
                </div>
              </article>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No jobs posted yet.</p>
                <button className="mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90" style={{ backgroundColor: '#70e000' }}>
                  Post Your First Job
                </button>
              </div>
            )}
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
              {tasks.length > 0 ? tasks.map((task: Task) => {
                const priorityClasses =
                  task.status === 'PENDING'
                    ? 'bg-rose-100 text-rose-700'
                    : task.status === 'IN_PROGRESS'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700';

                return (
                  <article
                    key={task.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-slate-800"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Job: {task.job.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-300">Created: {new Date(task.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityClasses}`}>
                        {task.status}
                      </span>
                    </div>
                  </article>
                );
              }) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No tasks assigned yet.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

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
