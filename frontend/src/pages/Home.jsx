import React from "react";
import HeroSection from "@/components/HeroSection";
import TopJobs from "@/components/TopJobs";
import EasyToUse from "@/components/EasyToUse";
import TrendingJobs from "@/components/TrendingJobs";


const Home = () => {
  return (
    <div>
      <HeroSection />
      <TrendingJobs />
      <TopJobs />
      <EasyToUse />
    </div>
  );
};

export default Home;
