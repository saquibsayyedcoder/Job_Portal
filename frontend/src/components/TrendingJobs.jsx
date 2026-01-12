import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "@/store/slices/jobSlice";

// ShadCN UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { FaBullhorn, FaCalendarAlt, FaUsers } from "react-icons/fa";

const TrendingJobs = () => {
  const [selectedJob, setSelectedJob] = useState("");
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleJobChange = (job) => {
    setSelectedJob(job);
  };

  const features = [
  {
    id: 1,
    title: "Post Jobs Instantly",
    description:
      "Employers can post job openings quickly with detailed role descriptions, requirements, and perks.",
    icon: "📝",
  },

 
  {
    id: 2,
    title: "Application Tracking",
    description:
      "Track, manage, and filter job applications in real-time from your employer dashboard.",
    icon: "📊",
  },
  {
    id: 3,
    title: "Secure Resume Storage",
    description:
      "Job seekers can upload, update, and manage resumes securely with easy access for employers.",
    icon: "🔒",
  },
];

  const role = user?.role;

  return (
    <section className="py-10 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
    <h1 className="text-center font-headming text-3xl md:text-4xl text-gray-800 mb-10">
      {(role === "Recruiter" || role === "Admin") ? "Portal Overview" : ""}
    </h1>

    {/* Show jobs to Job Seekers and Guests */}
    {(!user || role === "Job Seeker") && (
      <>
        {loading && !error && (
          <p className="text-center text-lg text-gray-500">Loading jobs...</p>
        )}

        {error && (
          <p className="text-center text-red-500 text-lg">{error}</p>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No jobs found matching your criteria.
          </p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="relative">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {jobs.map((job) => (
                  <CarouselItem
                    key={job._id}
                    className="md:basis-1/2 lg:basis-1/3 px-2"
                  >
                    <Card
                      onClick={() => handleJobChange(job)}
                      className="h-full hover:shadow-xl transition-transform hover:scale-[1.01] cursor-pointer"
                    >
                      <CardHeader className="flex justify-between items-start">
                        <Badge variant="secondary">
                          {job.hiringMultipleCandidates === "Yes"
                            ? "Multiple Openings"
                            : "Hiring"}
                        </Badge>
                        <p className="text-xs text-gray-400">
                          {job.jobPostedOn?.substring(0, 10)}
                        </p>
                      </CardHeader>

                      <CardContent>
                        <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                          {job.title}
                        </CardTitle>
                        <p className="text-lg text-gray-700">{job.companyName}</p>
                        {/* Qualifications */}
{job.qualifications && (
  <p className="text-sm text-gray-600 mb-1">
    {Array.isArray(job.qualifications)
      ? job.qualifications.join(" ")
      : String(job.qualifications)
          .split(",")
          .map((item) => item.trim())
          .join(" ")
    }
  </p>
)}

{/* Location */}
{job.location && (
  <p className="text-sm text-indigo-600">
    {Array.isArray(job.location)
      ? job.location.join(" ")
      : String(job.location)
          .split(",")
          .map((item) => item.trim())
          .join(" ")
    }
  </p>
)}
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-semibold">Salary:</span> {job.salary}
                        </p>
                      </CardContent>

                      <CardFooter>
                        <Link to={`/post/application/${job._id}`} className="w-full">
                          <Button className="w-full">Apply Now</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white border shadow-lg hover:bg-indigo-600 hover:text-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold transition duration-200" />
              <CarouselNext className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white border shadow-lg hover:bg-indigo-600 hover:text-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold transition duration-200" />
            </Carousel>
          </div>
        )}
      </>
    )}

    {/* Recruiter View */}
    {role === "Recruiter" && (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        {/* Post Job Card */}
        <Card className="border-l-4 border-indigo-500 bg-white shadow hover:shadow-lg transition-all rounded-2xl p-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-2 rounded-full">
                <FaBullhorn />
              </div>
              <CardTitle>Post a New Job</CardTitle>
            </div>
            <CardDescription>Reach thousands of job seekers instantly.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/dashboard/job-post" className="w-full">
              <Button className="w-full bg-indigo-700 text-white">Post Job</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Manage Applications */}
        <Card className="border-l-4 border-green-500 bg-white shadow hover:shadow-lg transition-all rounded-2xl p-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white p-2 rounded-full">
                <FaUsers />
              </div>
              <CardTitle>Manage Applications</CardTitle>
            </div>
            <CardDescription>Track job applications from applicants.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/dashboard/my-jobs" className="w-full">
              <Button variant="outline" className="w-full">View Applications</Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Interview Schedule */}
        <Card className="border-l-4 border-rose-500 bg-white shadow hover:shadow-lg transition-all rounded-2xl p-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-rose-600 text-white p-2 rounded-full">
                <FaCalendarAlt />
              </div>
              <CardTitle>Interview Schedule</CardTitle>
            </div>
            <CardDescription>View or update upcoming interviews.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/dashboard/applications" className="w-full">
              <Button variant="secondary" className="w-full">View Schedule</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )}

    {/* Admin View */}
    {role === "Admin" && (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        <Card className="border-l-4 border-blue-500 bg-white shadow hover:shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage registered users on the portal.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/admin/users" className="w-full">
              <Button variant="outline" className="w-full">View Users</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-l-4 border-yellow-500 bg-white shadow hover:shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>Manage Jobs</CardTitle>
            <CardDescription>View all posted jobs in the system.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/admin/jobs" className="w-full">
              <Button variant="outline" className="w-full">View Jobs</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="border-l-4 border-purple-500 bg-white shadow hover:shadow-lg rounded-2xl p-4">
          <CardHeader>
            <CardTitle>All Application</CardTitle>
            <CardDescription>Track key metrics and reports.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/admin/jobs" className="w-full">
              <Button variant="outline" className="w-full">View Analytics</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )}

    {/* Guest (non-logged-in) Info Cards */}
    {!user && (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        <Card className="bg-white shadow hover:shadow-xl rounded-2xl border-l-4 border-cyan-500 p-4">
          <CardHeader>
            <CardTitle>Explore Jobs</CardTitle>
            <CardDescription>Browse latest job opportunities for free.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white shadow hover:shadow-xl rounded-2xl border-l-4 border-lime-500 p-4">
          <CardHeader>
            <CardTitle>Register Account</CardTitle>
            <CardDescription>Create your free account to apply for jobs.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white shadow hover:shadow-xl rounded-2xl border-l-4 border-orange-500 p-4">
          <CardHeader>
            <CardTitle>Hire Talent</CardTitle>
            <CardDescription>Post jobs and manage applications as a recruiter.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )}
  </div>
  <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Job Portal Offers</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Empowering job seekers and employers with powerful tools to connect, hire, and grow.
        </p>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
</section>

  );
};

export default TrendingJobs;
