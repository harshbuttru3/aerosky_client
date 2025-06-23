const TowerProject = require('../models/TowerProjectModel');


module.exports.createTowerProject = async(req,res,next) => {
	try{
		const {name,referenceImage,projectArea,startDate,scope,type,coordinates,clientDetails} = req.body;
		const tower = await TowerProject.create({
			name,referenceImage,projectArea,startDate,scope,type,coordinates,clientDetails
		})
		if(tower){
			return res.json({status:true,tower})
		}
		return res.json({status:false,msg:"Something went wrong!"});
	}catch(ex){
		next(ex)
	}
}

module.exports.getTowerProject = async(req,res,next) => {
	try{
		const {id} = req.body;
		const tower = await TowerProject.find({_id:id});
		if(tower){
			return res.json({status:true,tower})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}


module.exports.updateTowerProjectFolders = async(req,res,next) => {
	try{
		const {id,folders} = req.body;
		console.log(id,folders);
		const project = TowerProject.findByIdAndUpdate(id,{
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


module.exports.updateGroupsInProject = async(req,res,next) => {
	try{
		const {groups,id} = req.body;
		console.log(id,groups)
		const project = TowerProject.findByIdAndUpdate(id,{
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

module.exports.fetchAllTowerProjects = async(req,res,next) => {
	try{
		const towerProject = await TowerProject.find();
		if(towerProject){
			return res.json({status:true,towerProject})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}