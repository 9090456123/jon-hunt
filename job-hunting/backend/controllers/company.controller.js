import {Company} from "../models/company.model.js"


// registering a company


export const registerCompany = async (req,res) => {
    try {
        const {companyName} = req.body;
        if(!companyName){
            return req.status(400).json({
                message:"Company name is Required",
                success:false
            });
        };
        let company = await Company.findOne({name:companyName})
        if(company){
            return res.status(400).json({
                message:"You can't register same copmany",
                success:false
            })
        }
        company = await Company.create({
            name:companyName,
            userId:req.id,

        })

        return res.status(201).json({
            message:"Company is registered sucesssfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }



}

export const getCompany = async (req,res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({userId});
        if(!companies) {
            return res.status(404).json({
                message:"Companies not found",
                success:false
            })
        }
    } catch (error) {
        console.log(error);
        
    }
}


// getting company by id

export const getCompanyById = async (req,res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({
                message:"Compsny not found",
                success:false
            })
        }
        return res.status(200).json({
            company,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}


// update company

export const updateCompany  = async (req,res) => {
    try {
        const {name, description, website, location} = req.body;
    } catch (error) {
        console.log(error);
        
    }
}