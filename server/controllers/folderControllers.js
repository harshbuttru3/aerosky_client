const Folder = require("../models/folderModel");

module.exports.createVideoFolder = async(req,res,next) => {
	try{
		const {name,folderCreatedDate,projectId,userDetails,folderId} = req.body;
		const folder = await Folder.create({
			name,folderCreatedDate,projectId,userDetails,folderId,videos:true
		})
		if (folder) {
			return res.json({status:true,folder})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}

module.exports.createFolder = async(req,res,next) => {
	try{
		const {name,folderCreatedDate,projectId,userDetails,folderId} = req.body;
		const folder = await Folder.create({
			name,folderCreatedDate,projectId,userDetails,folderId
		})
		console.log(folder);
		if (folder) {
			return res.json({status:true,folder})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}

module.exports.updateFilesInFolder = async(req,res,next) => {
	try{
		const {id,files} = req.body;
		const folder = Folder.findByIdAndUpdate(id,{
			files
		},{new:true},(err,obj)=>{
			if(err){
				return res.json({status:false,msg:"Something went wrong!"})
			}
			return res.json({status:true,folder:obj})
		})
	}catch(ex){
		next(ex)
	}
}

module.exports.getFoldersById = async(req,res,next) => {
	try{
		const {id} = req.body;
		const folder = await Folder.find({folderId:id,videos:false}).sort({ updatedAt: -1 });
		if(folder){
			return res.json({status:true,folder})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}

module.exports.getVideoFoldersById = async(req,res,next) => {
	try{
		const {id} = req.body;
		const folder = await Folder.find({folderId:id,videos:true}).sort({ updatedAt: -1 });
		if(folder){
			return res.json({status:true,folder})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}

module.exports.getFolderName = async(req,res,next) => {
	try{
		const {folderId} = req.body;
		const folder = await Folder.findOne({folderId});
		if(folder){
			return res.json({status:true,name:folder?.name})
		}
		return res.json({status:false})
	}catch(ex){
		next(ex)
	}
}