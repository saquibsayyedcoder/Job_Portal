import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const EmployerList = ({ recruiter = [] }) => {
  if (!recruiter || recruiter.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full">
        <h3 className="text-xl sm:text-2xl font-semibold text-purple-600 mb-4">
          Recruiters
        </h3>
        <p className="text-gray-600">No employer data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full">
      <h3 className="text-xl sm:text-2xl font-semibold text-teal-600 mb-4">
        Recruiters
      </h3>

      {/* Scrollable container */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 rounded-lg">
        <Table className="min-w-[800px] w-full text-sm sm:text-base">
          <TableHeader className="sticky top-0 z-10 bg-teal-500 text-white pointer-events-none">
            <TableRow className="cursor-default">
              <TableHead className="px-4 py-3 text-left text-white">Name</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Email</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Company Specialization</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Company Name</TableHead>
              <TableHead className="px-4 py-3 text-left text-white">Company Location</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {recruiter.map((user, index) => (
              <TableRow
                key={index}
                className={`transition duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-purple-50`}
              >
                <TableCell className="px-4 py-3 text-gray-800 font-medium">
                  {user.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600">
                  {user.companyDetails?.type || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600">
                  {user.companyDetails?.name || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-600">
                  {user.companyDetails?.location || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployerList;