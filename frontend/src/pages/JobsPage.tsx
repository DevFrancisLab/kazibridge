import { Link } from "react-router-dom";

const jobs = [
  { id: 1, title: "Mobile App UI Design", budget: "KES 120,000", status: "Open" },
  { id: 2, title: "React E-commerce Website", budget: "KES 250,000", status: "In Progress" },
  { id: 3, title: "SEO Content Writing", budget: "KES 45,000", status: "Completed" },
];

const JobsPage = () => (
  <section className="space-y-4">
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Job Listings</h2>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <article key={job.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{job.title}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Budget: {job.budget}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Status: {job.status}</p>
          <Link
            to={`/jobs/${job.id}`}
            className="mt-3 inline-block rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Details
          </Link>
        </article>
      ))}
    </div>
  </section>
);

export default JobsPage;
