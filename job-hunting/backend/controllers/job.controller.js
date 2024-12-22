import { Job } from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        // Check for missing fields
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements)
                ? requirements.map(req => req.trim())
                : requirements.split(",").map(req => req.trim()), // Ensure array of strings
            salary: Number(salary), // Convert salary to number
            location,
            jobType,
            experienceLevel: Number(experience), // Convert experience to number
            position: Number(position), // Convert position to number
            company: companyId,
            created_by: userId // Correctly mapped to match the schema
        });

        return res.status(201).json({
            message: "New Job Created Successfully",
            job,
            success: true,
        });
    } catch (error) {
        console.log(error);

    }
};

// Get all job

export const getAllJobs = async (req, res) => {
    try {
        const keywords = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keywords, $options: "i" } },
                { description: { $regex: keywords, $options: "i" } },
            ]
        }
        const jobs = await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1});
        if (!jobs) {
            return res.status(404).json({
                message: "Job not Found",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

// finding jobs by id

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        return res.status(200).json({
            job,
            success: true,
        });

    } catch (error) {
        console.log(error);

    }
}

// job by admin cradentials (for admin)

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ createdBy: adminId });
        if (!jobs) {
            return res.status(404).json({
                message: "Job not Found",
                success: false
            })
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}