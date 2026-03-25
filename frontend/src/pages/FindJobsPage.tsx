import { DashboardContent } from "@/components/DashboardLayout";

const FindJobsPage = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-black dark:text-white">Find Jobs</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Browse and apply for available jobs</p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-slate-800">
        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Available Jobs</h4>
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <h5 className="text-base font-semibold text-gray-900 dark:text-white">E-commerce Website Redesign</h5>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Complete redesign of an online store with modern UI/UX</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm font-medium text-green-600">KES 350,000</span>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                Apply Now
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-slate-800">
            <h5 className="text-base font-semibold text-gray-900 dark:text-white">Mobile App MVP</h5>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Build a minimum viable product for a React Native app</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm font-medium text-green-600">KES 420,000</span>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindJobsPage;