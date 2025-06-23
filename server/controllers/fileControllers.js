const File = require("../models/fileModel");

module.exports.createFile = async(req,res,next) => {
	try{
		const {url,name,fileDat,exif_data,folderId,tags} = req.body;
		console.log(tags);
		const file = await File.create({
			url,name,fileDat,exif_data,folderId,tags
		})
		if (file) {
			return res.json({status:true,file})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}

module.exports.getFilesByFolderId = async(req,res,next) => {
	try{
		const {folderId} = req.body;
		const file = await File.find({folderId:folderId});
		if(file){
			return res.json({status:true,file})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}

module.exports.fetchFilesLength = async(req,res,next) => {
	try{
		const {folderId} = req.body;
		const file = await File.find({folderId:folderId});
		if(file){
			return res.json({status:true,file:file.length})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}

module.exports.updateFileTags = async(req,res,next) => {
	try{
		const {tags,id} = req.body;
		const file = File.findByIdAndUpdate(id,{
			tags
		},{new:true},(err,obj)=>{
			if(err){
				return res.json({status:false,msg:"Something went wrong"})
			}
			return res.json({status:true,file:obj});
		})
	}catch(ex){
		next(ex)
	}
}

module.exports.getAllImageWithTags = async(req,res,next) => {
	try{
		const {tags} = req.body;
		console.log(tags)
		const file = File.find({tags:tags}).exec((err, file) => {
		    if (err) {
		        console.log(err);
		        return res.json({status:false,msg:"Something went wrong!"})

		    } else {
		       	return res.json({status:true,file})
		    }
		});
		// if(file){
		// 	return res.json({status:true,file})
		// }
		// return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}

module.exports.updateAnnotations = async(req,res,next) => {
	try{
		const {id,annotations} = req.body;
		const file = File.findByIdAndUpdate(id,{
			annotations
		},{new:true},(err,file)=>{
			if(err){
				return res.json({status:false,msg:"Something went wrong!"})
			}
			return res.json({status:true,file});
		})
	}catch(ex){
		next(ex)
	}
}

module.exports.fetchThermalImageByCoordinates = async(req,res,next) => {
	try{
		const {latitude,longitude,CreateDate} = req.body;
		const file = await File.find({
	      $and: [
	        { 'exif_data.latitude': latitude },
	        { 'exif_data.longitude': longitude },
	        { 'exif_data.CreateDate': CreateDate }
	      ]
	    })
		if(file){
			console.log(file,latitude,longitude,CreateDate);
			return res.json({status:true,file})
		}
		return res.json({status:false,msg:"Something went wrong!"})
	}catch(ex){
		next(ex)
	}
}