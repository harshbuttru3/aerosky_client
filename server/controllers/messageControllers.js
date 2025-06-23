const groupMessageModel = require('../models/groupMessageModel');
const messageModel = require('../models/messageModel');

module.exports.addMessage = async(req,res,next)=>{
	try{
		const{from,to,message,image} = req.body;
		const data = await messageModel.create({
			message:{text:message},
			users:[from,to],
			sender:from,
			senderImage:image
		})
		if(data){
			const msg = {
				fromSelf:data.sender.toString() === from,
				message:data.message.text,
				updatedAt:data.updatedAt,
				_id:data._id,
				seenBy:data.seenBy,
				sender:data.sender,
				senderImage:data.senderImage
			}
			return res.json({msg});
		}
		return res.json({msg:"Message Failed to Add in Database"});
	}catch(ex){
		next(ex)
	}
}

module.exports.addGroupMessage = async(req,res,next) => {
	try{
		const {from,to,message,groupId,image} = req.body;
		const data = await groupMessageModel.create({
			message:{text:message},
			users:[from,...to],
			sender:from,
			senderImage:image,
			groupId
		})
		if(data){
			const msg = {
				fromSelf:data.sender.toString() === from,
				message:data.message.text,
				updatedAt:data.updatedAt,
				_id:data._id,
				seenBy:data.seenBy,
				sender:data.sender,
				groupId:data.groupId,
				senderImage:data.senderImage
			}
			return res.json({msg});
		}
		return res.json({msg:"Message Failed to Add in Database"});
	}catch(ex){
		next(ex)
	}
}

module.exports.getMessage = async(req,res,next)=>{
	try{
		const {from,to} = req.body
		const messages = await messageModel.find({
			users:{
				$all:[from,to],
			},
		}).sort({ updatedAt:1 });
		const projectedMessages = messages.map((message)=>{
			return{
				fromSelf:message.sender.toString() === from,
				message:message.message.text,
				updatedAt:message.updatedAt,
				_id:message._id,
				seenBy:message.seenBy,
				sender:message.sender,
				senderImage:message.senderImage
			}
		})
		res.json(projectedMessages);
	}catch(ex){
		next(ex)
	}
}

module.exports.updateMsg = async(req,res,next) => {
	try{
		const {seenBy} = req.body;
		const id = req.params.id;
		const data = await messageModel.findByIdAndUpdate(id,{
			seenBy
		})
		return res.json({data:data});
	}catch(ex){
		next(ex)
	}
}

module.exports.updateGroupMsg = async(req,res,next) => {
	try{
		const {seenBy} = req.body;
		const id = req.params.id;
		const data = await groupMessageModel.findByIdAndUpdate(id,{
			seenBy
		})
		return res.json({data:data});
	}catch(ex){
		next(ex)
	}
}

module.exports.getGroupMessage = async(req,res,next)=>{
	try{
		const {groupId,from} = req.body
		const messages = await groupMessageModel.find({
			groupId:{
				$all:groupId,
			},
		}).sort({ updatedAt:1 });
		const projectedMessages = messages.map((message)=>{
			return{
				fromSelf:message.sender.toString() === from,
				message:message.message.text,
				updatedAt:message.updatedAt,
				_id:message._id,
				seenBy:message.seenBy,
				sender:message.sender,
				senderImage:message.senderImage
			}
		})
		res.json(projectedMessages);
	}catch(ex){
		next(ex)
	}
}