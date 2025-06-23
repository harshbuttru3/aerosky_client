const TagGroup = require('../models/tagGroupModel');


module.exports.createTagGroup = async(req,res,next) => {
	try{
		const {name,projectId,createdUser} = req.body;
		const tagGroup = await TagGroup.create({
			name,projectId,createdUser
		})
		if(tagGroup){
			return res.json({status:true,tagGroup})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
} 

module.exports.getTagGroups = async(req,res,next) => {
	try{
		const {groups} = req.body;
		const tagGroup = await TagGroup.find({_id:groups});
		if(tagGroup){
			return res.json({status:true,tagGroup})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}

module.exports.updateTagsInGroup = async(req,res,next) => {
	try{
		const {id,tags} = req.body;
		const tagGroup = TagGroup.findByIdAndUpdate(id,{
			tags:tags
		},{new:true},(err,obj)=>{
			if(err){
				return res.json({status:false,msg:"Something went wrong!"})
			}
			return res.json({status:true,tagGroup:obj});
		})
	}catch(ex){
		next(ex)
	}
}

module.exports.getAllGroupsWithId = async(req,res,next) => {
	try{
		const {groups} = req.body;
		console.log(groups)
		const tagGroup = await TagGroup.find({_id:groups});
		console.log(tagGroup)
		if(tagGroup){
			return res.json({status:true,tagGroup})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){	
		next(ex)
	}
}