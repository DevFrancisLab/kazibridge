import { DashboardContent } from "@/components/DashboardLayout";

const TasksPage = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-black dark:text-white">My Tasks</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Manage your assigned tasks and track progress</p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Active Tasks</h4>
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-base font-semibold text-gray-900 dark:text-white">Logo Design for Tech Startup</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Job: Brand Identity Package</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Due: March 30, 2026</p>
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">In Progress</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Update Progress
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-base font-semibold text-gray-900 dark:text-white">Website Mockups</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Job: E-commerce Redesign</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Due: April 5, 2026</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                Mark Complete
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TasksPage;