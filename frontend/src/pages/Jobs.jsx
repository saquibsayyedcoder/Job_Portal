import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAllJobErrors, fetchJobs } from "@/store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Jobs = () => {
  const [cityFilter, setCityFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const debounceTimer = useRef(null);
  const hasInitiallyLoaded = useRef(false);

  // Cities and job titles
  const cities = [
    "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar", "Dhahran", "Taif", "Abha",
    "Khamis Mushait", "Al Hofuf", "Al Mubarraz", "Jubail", "Hafar Al-Batin", "Al Qatif",
    "Najran", "Yanbu", "Al Khafji", "Buraidah", "Unaizah", "Hail", "Arar", "Sakaka", "Jizan",
    "Tabuk", "Al Bahah", "Al Wajh", "Ras Tanura", "Al Majma'ah", "Al Qurayyat", "Al Lith",
    "Al Aflaj", "Al Kharj", "Rabigh", "Turaif", "Al Ula", "Al Birk", "Al Duwadimi", "Thuwal",
    "Duba", "Wadi ad-Dawasir", "Baljurashi", "Al Muzahimiyah", "Al Namas", "Bisha",
    "Mahd adh Dhahab", "Umluj", "Al Bukayriyah", "Samtah", "Sabya", "Ranyah", "Qurayyat",
    "Sharurah", "Ad Dilam", "Muzahmiyya", "Afif", "Al Zulfi", "Al Artawiyah", "Hotat Bani Tamim",
    "Dawadmi", "Al-'Uyayna", "Qatif", "Al Jumum", "Al Awjam", "Al Darb", "Tanumah", "Turubah",
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad",
    "Surat", "Jaipur", "Lucknow", "Bhopal", "Indore", "Nagpur", "Kanpur", "Patna", "Coimbatore",
    "Kochi", "Thiruvananthapuram", "Chandigarh"
  ];

  const jobArray = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist",
    "UX/UI Designer", "Product Manager", "Mobile App Developer", "DevOps Engineer",
    "Cloud Engineer", "Machine Learning Engineer", "AI Research Scientist",
    "Cybersecurity Specialist", "Network Engineer", "Systems Administrator", "Software Engineer",
    "Web Developer", "Game Developer", "Blockchain Developer", "Quality Assurance Engineer",
    "Technical Support Engineer", "Cloud Architect", "Data Engineer", "Software Architect",
    "Business Intelligence Analyst", "Digital Marketing Specialist", "SEO Specialist",
    "IT Consultant", "Technical Project Manager", "Database Administrator", "Salesforce Developer",
    "JavaScript Developer", "Ruby on Rails Developer", "PHP Developer", "C# Developer",
    "Python Developer", "Accountant", "Sales Executive", "Marketing Manager", "HR Executive",
    "Customer Support", "Content Writer", "Graphic Designer", "Mechanical Engineer",
    "Civil Engineer", "Electrical Engineer", "Teacher / Tutor", "Operations Manager",
    "Business Development Executive", "Store Manager", "Procurement Specialist",
    "Medical Representative", "Pharmacist", "Event Coordinator", "Chef / Cook",
    "Logistics Coordinator", "Mechanical Engineering", "Electrical Engineering",
    "Civil Engineering", "Electronics and Communication Engineering", "Instrumentation Engineering",
    "Chemical Engineering", "Automobile Engineering", "Aerospace Engineering",
    "Industrial Engineering", "Metallurgical Engineering", "Mining Engineering",
    "Mechatronics Engineering", "Petroleum Engineering", "Marine Engineering",
    "Environmental Engineering", "Structural Engineering", "Robotics Engineering",
    "Textile Engineering", "Production Engineering", "Thermal Engineering", "Project Director",
    "Project Manager", "Deputy Project Manager", "Project Control Manager", "Planning Supervisor",
    "Planning Engineers", "Schedulers", "Cost Control Engineer", "Risk Manager",
    "Contract Administrator", "Interface Manager", "Document Controller", "Civil Engineer",
    "Structural Engineer", "Geotechnical Engineer", "Draftsman", "Mechanical Engineer",
    "HVAC Engineer", "Equipment Engineer", "Stress Analyst", "Piping Engineer",
    "Layout Engineer", "Piping Material Engineer", "3D Modeler/Draftsman", "Electrical Engineer",
    "Power Systems Engineer", "Lighting & Earthing Designer", "Instrumentation Engineer",
    "Control Systems Engineer (DCS/PLC)", "Analyzer Engineer", "Process Engineer",
    "Simulation Specialist", "HAZOP/Process Safety Engineer", "MEP Engineer",
    "Lead Discipline Engineers", "Design Coordinator", "Interface Engineer", "Procurement Manager",
    "Procurement Engineer", "Buyer", "Expeditor", "Logistics Coordinator", "Material Controller",
    "Vendor Coordinator", "Construction Manager", "General Superintendent", "Site Civil Engineers",
    "Site Mechanical Engineers", "Site Electrical Engineers", "Site I&C Engineers",
    "MEP Supervisor", "MEP Foreman", "Surveyor", "Site Admin/Timekeeper", "Plumbers",
    "Welders", "Fitters", "Electricians", "Riggers", "Scaffolders", "QA/QC Manager",
    "Discipline Supervisors & Inspectors", "NDT Technician", "Calibration Engineer",
    "Procurement QA/QC Engineer", "HSE Manager", "Safety Officer", "Safety Supervisor",
    "Environmental Engineer", "Industrial Hygienist", "Commissioning Manager",
    "Commissioning Engineers Process", "Commissioning Engineers Mechanical",
    "Commissioning Engineers Electrical", "Commissioning Engineers I&C",
    "Pre-Commissioning Technicians", "DCS/PLC Engineers", "Punch List Coordinator",
    "System Completion Coordinator", "Secretary / Administrative Assistant", "Male Nurse",
    "Resident Doctor", "Driver Light Vehicle", "Driver Bus", "Crane Operator",
    "Heavy Equipment Operator Excavator", "Heavy Equipment Operator Loader",
    "Heavy Equipment Operator Dozer", "Forklift Operator", "Manlift Operator",
    "Utility Worker / General Labor", "Camp Boss / Camp Administrator", "Janitor / Housekeeping Staff",
    "Cook / Catering Staff", "Security Guard"
  ];

  // ✅ Safe string conversion utility
  const toString = (value) => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.filter(Boolean).join(', ');
    if (value && typeof value.toString === 'function') return value.toString();
    return '';
  };

  // ✅ Normalize text for search
  const normalize = (str) => toString(str).trim().toLowerCase();

  // Filtered jobs based on all filters
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    // Filter by city
    if (cityFilter) {
      const cityLower = cityFilter.toLowerCase();
      filtered = filtered.filter((job) =>
        normalize(job.location).includes(cityLower)
      );
    }

    // Filter by job type
    if (jobFilter) {
      const jobLower = jobFilter.toLowerCase();
      filtered = filtered.filter((job) =>
        normalize(job.title).includes(jobLower)
      );
    }

    // Filter by search keyword
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter((job) =>
        normalize(job.title).includes(keyword) ||
        normalize(job.companyName).includes(keyword) ||
        normalize(job.location).includes(keyword) ||
        normalize(job.qualifications).includes(keyword)
      );
    }

    return filtered;
  }, [jobs, cityFilter, jobFilter, searchKeyword]);

  // Get search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchInput || searchInput.length < 1) return [];

    const keyword = searchInput.toLowerCase();
    const suggestions = new Set();

    // Helper to add suggestion if it starts with keyword
    const addIfStartsWith = (str) => {
      const norm = normalize(str);
      if (norm && norm.startsWith(keyword)) {
        suggestions.add(str); // keep original case
      }
    };

    // Add job titles, cities, company names, etc.
    jobArray.forEach(addIfStartsWith);
    cities.forEach(addIfStartsWith);
    jobs.forEach((job) => {
      addIfStartsWith(job.title);
      addIfStartsWith(job.companyName);
    });

    // Fallback: include partial matches if not enough suggestions
    if (suggestions.size < 5) {
      const addIfIncludes = (str) => {
        const norm = normalize(str);
        if (norm && norm.includes(keyword)) {
          suggestions.add(str);
        }
      };
      jobArray.forEach(addIfIncludes);
      cities.forEach(addIfIncludes);
      jobs.forEach((job) => {
        addIfIncludes(job.title);
        addIfIncludes(job.companyName);
      });
    }

    // Deduplicate, sort, limit
    return Array.from(suggestions)
      .sort((a, b) => normalize(a).localeCompare(normalize(b)))
      .slice(0, 8);
  }, [searchInput, jobs, jobArray, cities]);

  // Fetch all jobs initially
  const fetchAllJobs = useCallback(() => {
    dispatch(fetchJobs("", "", ""));
  }, [dispatch]);

  // Handle error notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
  }, [dispatch, error]);

  // Initial load
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      fetchAllJobs();
      hasInitiallyLoaded.current = true;
    }
  }, [fetchAllJobs]);

  // Handle city filter change
  const handleCityChange = useCallback((newCity) => {
    setCityFilter(newCity);
  }, []);

  // Handle job filter change
  const handleJobChange = useCallback((newJob) => {
    setJobFilter(newJob);
  }, []);

  // Handle search input change with debouncing
  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setSearchKeyword(value);
    }, 300);
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchInput(suggestion);
    setSearchKeyword(suggestion);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);

  // Handle manual search
  const handleSearch = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setSearchKeyword(searchInput);
  }, [searchInput]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setCityFilter("");
    setJobFilter("");
    setSearchKeyword("");
    setSearchInput("");
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <>
      {loading && !hasInitiallyLoaded.current ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <section className="bg-slate-100 min-h-screen p-4 md:p-8">
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search for jobs, companies, or locations..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {/* Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
              >
                Find Job
              </Button>
              <Button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 whitespace-nowrap"
              >
                Clear All
              </Button>
            </div>

            {/* Active Filters */}
            {(cityFilter || jobFilter || searchKeyword) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {cityFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    City: {cityFilter}
                    <button
                      onClick={() => handleCityChange("")}
                      className="ml-2 w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {jobFilter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Job: {jobFilter}
                    <button
                      onClick={() => handleJobChange("")}
                      className="ml-2 w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchKeyword && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Search: "{searchKeyword}"
                    <button
                      onClick={() => {
                        setSearchKeyword("");
                        setSearchInput("");
                      }}
                      className="ml-2 w-4 h-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Filters + Job Cards */}
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-md order-2 lg:order-1">
              {/* City Filter */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Filter by City</h2>
                  {cityFilter && (
                    <button onClick={() => handleCityChange("")} className="text-sm text-indigo-600 hover:text-indigo-800">
                      Clear
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="city" checked={!cityFilter} onChange={() => handleCityChange("")} className="text-indigo-600" />
                    <span className="text-gray-700 font-semibold">All Cities</span>
                  </label>
                  {cities.map((city, i) => (
                    <label key={i} className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="city" checked={cityFilter === city} onChange={() => handleCityChange(city)} className="text-indigo-600" />
                      <span className="text-gray-700">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Filter */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Filter by Job</h2>
                  {jobFilter && (
                    <button onClick={() => handleJobChange("")} className="text-sm text-indigo-600 hover:text-indigo-800">
                      Clear
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="job" checked={!jobFilter} onChange={() => handleJobChange("")} className="text-indigo-600" />
                    <span className="text-gray-700 font-semibold">All Jobs</span>
                  </label>
                  {jobArray.map((job, i) => (
                    <label key={i} className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="job" checked={jobFilter === job} onChange={() => handleJobChange(job)} className="text-indigo-600" />
                      <span className="text-gray-700">{job}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Job Cards */}
           <main className="w-full lg:w-3/4 order-1 lg:order-2">
  {/* Results Header */}
  <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <p className="text-gray-600 text-sm sm:text-base">
      <span className="font-semibold text-gray-800">{filteredJobs.length}</span>{" "}
      job{filteredJobs.length !== 1 ? "s" : ""} found
      {(cityFilter || jobFilter || searchKeyword) && (
        <span className="text-gray-500 ml-1"> (from {jobs.length} total)</span>
      )}
    </p>
    {loading && hasInitiallyLoaded.current && (
      <div className="text-sm text-blue-600 font-medium animate-pulse">
        Updating...
      </div>
    )}
  </div>

  {/* No Jobs Found */}
  {filteredJobs.length === 0 ? (
    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">No jobs match your search</h3>
      <p className="text-gray-500 mb-4">Try adjusting your filters or search term.</p>
      <button
        onClick={handleClearFilters}
        className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Clear All Filters
      </button>
    </div>
  ) : (
    /* Job Cards Grid */
    <div className="grid grid-cols-1 max-h-screen overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredJobs.map((jobItem) => (
        <article
          key={jobItem._id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:shadow-indigo-50/70 transition-all duration-300 group flex flex-col h-full"
          style={{ breakInside: "avoid" }}
        >
          {/* Badge & Date */}
          <div className="flex justify-between items-start px-5 pt-5">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                jobItem.hiringMultipleCandidates === "Yes"
                  ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                  : "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
              }`}
            >
              {jobItem.hiringMultipleCandidates === "Yes" ? "Multiple Openings" : "Hiring"}
            </span>
            <time className="text-xs text-gray-500 whitespace-nowrap">
              Posted: {new Date(jobItem.createdAt).toLocaleDateString()}
            </time>
          </div>

          {/* Content */}
          <div className="p-5 pt-4 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 line-clamp-2 transition-colors duration-200">
              {jobItem.title}
            </h3>

            {/* Company */}
            <p className="text-md text-gray-700 font-medium mb-2 truncate">{jobItem.companyName}</p>

            {/* Location */}
            <p className="text-sm font-medium text-indigo-600 mb-3 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {Array.isArray(jobItem.location)
                ? jobItem.location.filter(Boolean).join(", ")
                : typeof jobItem.location === "string"
                ? jobItem.location
                    .split(",")
                    .map((l) => l.trim())
                    .filter(Boolean)
                    .join(", ")
                : "Location not specified"}
            </p>

            {/* Qualifications */}
            {jobItem.qualifications && (
              <div className="flex flex-wrap gap-1 mb-3">
                {(() => {
                  let qualArray = [];
                  const qual = jobItem.qualifications;
                  if (typeof qual === "string") {
                    qualArray = qual
                      .split(",")
                      .map((q) => q.trim())
                      .filter(Boolean);
                  } else if (Array.isArray(qual)) {
                    qualArray = qual.map(String).filter(Boolean);
                  } else if (qual && typeof qual.toString === "function") {
                    qualArray = [qual.toString().trim()];
                  }
                  return (
                    <>
                      {qualArray.slice(0, 3).map((q, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {q}
                        </span>
                      ))}
                      {qualArray.length > 3 && (
                        <span className="text-xs text-gray-500">+{qualArray.length - 3}</span>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Skills */}
            {jobItem.requiredSkill && (
              <div className="flex flex-wrap gap-1 mb-3">
                {(() => {
                  let skillArray = [];
                  const skill = jobItem.requiredSkill;
                  if (typeof skill === "string") {
                    skillArray = skill
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                  } else if (Array.isArray(skill)) {
                    skillArray = skill.map(String).filter(Boolean);
                  } else if (skill && typeof skill.toString === "function") {
                    skillArray = [skill.toString().trim()];
                  }
                  return (
                    <>
                      {skillArray.slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-100"
                        >
                          {s}
                        </span>
                      ))}
                      {skillArray.length > 4 && (
                        <span className="text-xs text-gray-500">+{skillArray.length - 4}</span>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {/* Posted By */}
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium text-gray-800">Posted By:</span>{" "}
              {jobItem.postedBy?.name || "Recruiter"}
            </p>

            {/* Salary */}
            {jobItem.salary?.trim() && (
              <p className="text-sm text-gray-700 mb-4 font-medium">
                💰 <span className="font-semibold text-gray-800">Salary:</span> {jobItem.salary}
              </p>
            )}
          </div>

          {/* Apply Button */}
          <div className="px-5 pb-5">
            <Link
              to={`/post/application/${jobItem._id}`}
              className="w-full inline-block text-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply Now
            </Link>
          </div>
        </article>
      ))}
    </div>
  )}
</main>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;