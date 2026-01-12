import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
//import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";
import axios from "axios";

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    requiredSkill,
    salary,
    personalWebsiteTitle,
    personalWebsiteUrl,
    hiringMultipleCandidates,
    jobRole,
    accommodation,
    food,
    travel,
  } = req.body;

  // Normalize requiredSkill to flat array of non-empty strings
  const skillArray = Array.isArray(requiredSkill)
    ? requiredSkill.flat(Infinity).map(s => String(s).trim()).filter(s => s !== '')
    : typeof requiredSkill === 'string' && requiredSkill.trim() !== ''
      ? [requiredSkill.trim()]
      : [];

  // Normalize qualifications to flat array of non-empty strings
  const qualificationArray = Array.isArray(qualifications)
    ? qualifications.flat(Infinity).map(q => String(q).trim()).filter(q => q !== '')
    : typeof qualifications === 'string' && qualifications.trim() !== ''
      ? [qualifications.trim()]
      : [];

       // Normalize location to flat array of non-empty strings
 const locationArray = Array.isArray(location)
  ? location.flat(Infinity).map(l => String(l).trim()).filter(l => l !== '')
  : typeof location === 'string' && location.trim() !== ''
    ? [location.trim()]
    : [];

    // Normalize jobRole (just like others)
const jobRoleArray = Array.isArray(jobRole)
  ? jobRole.flat(Infinity).map(r => String(r).trim()).filter(r => r !== '')
  : typeof jobRole === 'string' && jobRole.trim() !== ''
    ? [jobRole.trim()]
    : [];

  // Required fields validation (use normalized arrays)
  if (
    !title ||
    !jobType ||
  locationArray.length === 0 ||
    !companyName ||
    !introduction ||
    !responsibilities ||
    jobRoleArray.length === 0 || 
    skillArray.length === 0 ||
    qualificationArray.length === 0
  ) {
    return next(new ErrorHandler("Please provide all required job details, including at least one skill and one qualification.", 400));
  }

  // Validate personal website (both or none)
  if ((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)) {
    return next(
      new ErrorHandler("Provide both website title and URL, or leave both blank.", 400)
    );
  }

  const postedBy = req.user._id;

  // Create job
  const job = await Job.create({
    title,
    jobType,
    location:locationArray,
    companyName,
    introduction,
    responsibilities,
    qualifications: qualificationArray, // ✅ cleaned
    requiredSkill: skillArray,           // ✅ cleaned
    salary,
    hiringMultipleCandidates: hiringMultipleCandidates === "Yes" || hiringMultipleCandidates === true,
    personalWebsite: {
      title: personalWebsiteTitle || undefined,
      url: personalWebsiteUrl || undefined,
    },
   jobRole: jobRoleArray, // ✅ not raw jobRole
    offers: {
      accommodation: !!accommodation,
      food: !!food,
      travel: !!travel,
    },
    postedBy,
  });

  let populatedJob = job;

  try {
    populatedJob = await Job.findById(job._id)
      .populate("postedBy", "name email role")
      .populate("likes", "name email");
  } catch (err) {
    console.error("Failed to populate job:", err.message);
  }

  // Notify job seekers via WhatsApp
  try {
    const jobSeekers = await User.find({ role: "Job Seeker" });

    const whatsappMessage = `🚀 New Job Alert!\n\n📌 ${title}\n🏢 ${companyName}\n📍 ${location}\n💼 ${jobRole}\n\nApply now and grow your career!`;

    for (const seeker of jobSeekers) {
      if (seeker.phone) {
        const whatsappUrl = `http://wa.techrush.in/api/authkeywa-api.php?authkey=333361697a747377613130301748931177&route=68&number=${seeker.phone}&message=${encodeURIComponent(
          whatsappMessage
        )}`;
        try {
          await axios.get(whatsappUrl);
          console.log(`📲 Sent to ${seeker.phone}`);
        } catch (error) {
          console.error(`❌ Failed for ${seeker.phone}:`, error.message);
        }
      }
    }
  } catch (err) {
    console.error("❌ WhatsApp broadcast error:", err.message);
  }

  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job: populatedJob,
  });
});

//create all jobs function
export const getAllJobs = catchAsyncErrors(async(req,res,next)=>{
    const {city, job, searchKeyword} = req.query;
    const query = {};
    if(city){
        query.location = city;
    }
    if(job){
        query.jobRole = job

    }

    //search the title of job, companyName, introduction of company
    if(searchKeyword){
        query.$or = [
            {title:{$regex: searchKeyword, $options: "i"}},
            {companyName:{$regex: searchKeyword, $options: "i"}},
            {introduction:{$regex: searchKeyword, $options: "i"}},
        ];
    }
    const jobs = await Job.find(query).populate('postedBy', 'name email role');
    res.status(200).json({
        success:true,
        jobs,
        //how many jobs we got
        count: jobs.length,
    })

})

//my jobd function
export const getMyJobs  = catchAsyncErrors(async(req,res,next)=>{
    const myJobs = await Job.find({ postedBy: req.user._id }).populate('postedBy', 'name email role');

    res.status(200).json({
        success:true,
        myJobs,
    })
});

//delete job functions
export const deleteJob  = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    const job = await Job.findById(id)
    if(!job){
        return next(new ErrorHandler("Oops! Job not found.", 404));
    }
    await job.deleteOne();
    res.status(200).json({
        success:true,
        message:"Job Deleted",
    });
});

//GET A SINGLE JOB 
export const getASingleJob  = catchAsyncErrors(async(req,res,next)=>{
    const {id} = req.params;
    const job = await Job.findById(id).populate('postedBy', 'name email role');

    if(!job){
        return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
        success:true,
        job,
    });
})

// Like or unlike a job
export const likeJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  const isLiked = job.likes.some(id => id.toString() === userId.toString());

  if (isLiked) {
    job.likes = job.likes.filter(id => id.toString() !== userId.toString());
    await job.save();
    return res.status(200).json({
      success: true,
      message: "Job unliked.",
      likes: job.likes.length,
    });
  } else {
    job.likes.push(userId);
    await job.save();
    const populated = await Job.findById(job._id).populate("likes", "name email");
    res.status(200).json({
      success: true,
      message: "Job liked!",
      likes: populated.likes,
    });
  }
});