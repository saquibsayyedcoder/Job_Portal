import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear().toString().slice(-2)}`;
};

const JobSeekerList = ({ jobSeekers = [] }) => {
  if (!jobSeekers || jobSeekers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Job Seekers</h3>
        <p className="text-gray-600">No job seeker data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <h3 className="text-2xl font-semibold text-black mb-4">Job Seekers</h3>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <Table className="min-w-[1000px] w-full text-sm sm:text-base">
          <TableHeader className="sticky top-0 z-10 bg-indigo-600 text-white">
            <TableRow className="cursor-default">
              <TableHead className="px-4 py-3 text-left text-white">Name</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Email</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Education</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Role</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Exp (Yrs)</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Location</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Preference</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Nationality</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">DOB</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Gender</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Marital</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Total Exp</TableHead>
               <TableHead className="px-4 py-3 text-left text-white">Certification</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {jobSeekers.map((user, index) => (
              <TableRow
                key={index}
                className={`transition duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                } hover:bg-indigo-50`}
              >
                <TableCell className="px-4 py-3 text-gray-800 whitespace-nowrap font-medium">
                  {user.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.educationQualification || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.roleSeeking || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.totalExperience || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.address || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.locationPreference || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.nationality || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {formatDate(user.dob)}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.gender || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.maritialStatus || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.totalExperience || "N/A"}
                </TableCell>
                 <TableCell className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {user.approvalCertification || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JobSeekerList;