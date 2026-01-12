
// src/components/HowItWorks.jsx

import { LuUserPlus } from 'react-icons/lu';
import { VscTasklist } from 'react-icons/vsc';
import { BiSolidLike } from 'react-icons/bi';

export default function HowItWorks() {
  return (
    <>

<div className="howItWorks p-6 bg-gray-50 relative">
  {/* Background Image Section */}
  <div 
    className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30" 
    style={{
      backgroundImage: "url('https://images.pexels.com/photos/4623350/pexels-photo-4623350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
    }}
  />
  
  {/* Overlay to make text more readable */}
  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40"></div>

  {/* Text Section */}
  <div className="relative z-10">
    <h3 className="text-3xl font-bold text-center mb-4 text-white">
      How does it work?
    </h3>
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Card 1: Create an Account */}
      <div className="card max-w-sm mx-auto shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="icon text-center py-8 bg-orange-200">
          <LuUserPlus className="text-4xl text-black ml-5" />
        </div>
        <div className="card-content px-6 py-4">
          <h4 className="text-xl font-semibold text-center">Create an Account</h4>
          <p className="text-white mt-2">
            Sign up for a free account as a job seeker or employer. Set up your
            profile in minutes to start posting jobs or applying for jobs.
            Customize your profile to highlight your skills or requirements.
          </p>
        </div>
      </div>

      {/* Card 2: Post or Browse Jobs */}
      <div className="card max-w-sm mx-auto shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="icon text-center py-8 bg-orange-200">
          <VscTasklist className="text-4xl text-black ml-5" />
        </div>
        <div className="card-content px-6 py-4">
          <h4 className="text-xl font-semibold text-center">Post or Browse Jobs</h4>
          <p className="text-white mt-2">
            Employers can post detailed job descriptions, and job seekers can
            browse a comprehensive list of available positions. Utilize filters
            to find jobs that match your skills and preferences.
          </p>
        </div>
      </div>

      {/* Card 3: Hire or Get Hired */}
      <div className="card max-w-sm mx-auto shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="icon text-center py-8 bg-orange-200">
          <BiSolidLike className="text-4xl text-black ml-5" />
        </div>
        <div className="card-content px-6 py-4">
          <h4 className="text-xl font-semibold text-center">Hire or Get Hired</h4>
          <p className="text-white mt-2">
            Employers can shortlist candidates and extend job offers. Job
            seekers can review job offers and accept positions that align with
            their career goals.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
    
  );
}
