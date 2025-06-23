const SolarProject = require('../models/solarProjectModel');


module.exports.createSolarProject = async(req,res,next) => {
	try{
		const {name,referenceImage,projectArea,startDate,scope,type,coordinates,clientDetails} = req.body;
		const solar = await SolarProject.create({
			name,referenceImage,projectArea,startDate,scope,type,coordinates,clientDetails
		})
		if(solar){
			return res.json({status:true,solar})
		}
		return res.json({status:false,msg:"Something went wrong!"});
	}catch(ex){
		next(ex)
	}
}

module.exports.getSolarProject = async(req,res,next) => {
	try{
		const {id} = req.body;
		const solar = await SolarProject.find({_id:id});
		if(solar){
			return res.json({status:true,solar})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}


module.exports.updateSolarProjectFolders = async(req,res,next) => {
	try{
		const {id,folders} = req.body;
		console.log(id,folders);
		const project = SolarProject.findByIdAndUpdate(id,{
			folders
		},{new:true},(err,obj)=>{
			if(err){
				return res.json({status:false,msg:"Something went wrong!"})
			}
			console.log(err,obj);
			return res.json({status:true,project:obj});
		})
	}catch(ex){
		next(ex)
	}
}


module.exports.updateGroupsInSolarProject = async(req,res,next) => {
	try{
		const {groups,id} = req.body;
		console.log(id,groups)
		const project = SolarProject.findByIdAndUpdate(id,{
			groups:groups
		},{new:true},(err,obj)=>{
			if(err){
				return res.json({status:false,msg:"Something went wrong!"})
			}
			console.log(obj);
			return res.json({status:true,project:obj})
		})
	}catch(ex){
		next(ex)
	}
}

module.exports.updateSolarProjectThermalFolders = async(req,res,next) => {
	try{
		const {id,thermalFolders} = req.body;
		console.log(id,thermalFolders);
		const project = SolarProject.findByIdAndUpdate(id,{
			thermalFolders
		},{new:true},(err,obj)=>{
			if(err){
				return res.json({status:false,msg:"Something went wrong!"})
			}
			console.log(err,obj);
			return res.json({status:true,project:obj});
		})
	}catch(ex){
		next(ex)
	}
}

module.exports.fetchAllSolarProjects = async(req,res,next) => {
	try{
		const solarProject = await SolarProject.find();
		if(solarProject){
			return res.json({status:true,solarProject})
		} 
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}