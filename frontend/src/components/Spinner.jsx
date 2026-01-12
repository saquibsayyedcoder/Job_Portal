// Spinner.jsx
import React from 'react';
import { ClipLoader } from 'react-spinners'; // You can change this to use a different spinner from react-spinners

const Spinner = ({ 
  size = 50,           // Default size
  color = "#4f46e5",   // Default color (Tailwind Indigo-600)
  loading = true,      // Control spinner visibility
  fullscreen = false,  // Option for fullscreen overlay
  className = "",      // Additional classes for the container
  style = {}           // Additional inline styles for the container
}) => {
  // Container classes based on props
  const containerClasses = `flex items-center justify-center ${
    fullscreen 
      ? "fixed inset-0 z-50 bg-white bg-opacity-70" // Fullscreen overlay
      : "w-full" // Default block behavior
  } ${className}`;

  // Inner container for spinner, provides minimum height when not fullscreen
  const innerContainerStyle = fullscreen 
    ? {} 
    : { minHeight: '200px' }; // Adjust minimum height as needed for non-fullscreen

  return (
    loading && (
      <div className={containerClasses} style={{ ...style }}>
        <div style={innerContainerStyle} className="flex items-center justify-center">
          <ClipLoader
            size={size}
            color={color}
            aria-label="Loading Spinner"
            data-testid="loading-spinner" // Standard test id
          />
        </div>
      </div>
    )
  );
};

export default Spinner;

// import React, { useState, useEffect } from 'react';

// // Shimmer component for a single card or filter item
// const Shimmer = () => {
//   return (
//     <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse h-12 w-full mb-4 rounded-lg"></div>
//   );
// };

// // JobCard component with shimmer effect
// const JobCardShimmer = () => {
//   return (
//     <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse h-48 w-full rounded-lg mb-4">
//       <div className="h-4 bg-gray-300 w-3/4 mb-2"></div>
//       <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
//       <div className="h-6 bg-gray-300 w-2/4 mb-2"></div>
//       <div className="h-4 bg-gray-300 w-1/3"></div>
//     </div>
//   );
// };

// // Main component with filters and job cards
// const JobListingPage = () => {
//   const [data, setData] = useState(null);
//   const [filters, setFilters] = useState({ city: '', job: '' });

//   // Simulate loading job data
//   useEffect(() => {
//     setTimeout(() => {
//       setData([
        
//       ]);
//     }, 3000); // Simulate 3 seconds of loading
//   }, []);

//   return (
//     <div className="flex">
//       {/* Left Filter Section */}
//       <div className="w-1/4 p-4">
//         <h2 className="text-xl font-semibold mb-4">Filters</h2>
//         <div>
//           <h3 className="font-medium text-lg mb-2">City</h3>
//           {data ? (
//             <select
//               value={filters.city}
//               onChange={(e) => setFilters({ ...filters, city: e.target.value })}
//               className="w-full p-2 border border-gray-300 rounded"
//             >
//               <option value="">All Cities</option>
             
//             </select>
//           ) : (
//             <Shimmer />
//           )}
//         </div>

//         <div>
//           <h3 className="font-medium text-lg mb-2 mt-4">Job</h3>
//           {data ? (
//             <select
//               value={filters.job}
//               onChange={(e) => setFilters({ ...filters, job: e.target.value })}
//               className="w-full p-2 border border-gray-300 rounded"
//             >
//               <option value="">All Jobs</option>
              
//             </select>
//           ) : (
//             <Shimmer />
//           )}
//         </div>
//       </div>

//       {/* Middle Job Cards Section */}
//       <div className="w-3/4 p-4">
//         <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {data ? (
//             data.map((job) => (
//               <div key={job.id} className="p-4 border rounded-lg shadow-md">
//                 <h3 className="text-lg font-bold">{job.title}</h3>
//                 <p className="text-sm text-gray-600">{job.company}</p>
//                 <p className="text-sm text-gray-500">{job.city}</p>
//               </div>
//             ))
//           ) : (
//             // Display shimmer effect for job cards while loading
//             Array(6)
//               .fill(0)
//               .map((_, index) => <JobCardShimmer key={index} />)
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobListingPage;
