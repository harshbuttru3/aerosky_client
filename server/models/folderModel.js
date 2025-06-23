const mongoose = require('mongoose')


const folderSchema = new mongoose.Schema({
	name:{
		type:String,
		required:[true,"I need name"]
	},
	folderCreatedDate:{
		type:String,
		required:[true,"I need date"]
	},
	files:{
		type:Array,
		default:[]
	},
	videos:{
		type:Boolean,
		default:false
	},
	projectId:{
		type:String,
		required:[true,"Which project i am created ?"]
	},
	userDetails:{
		type:Object,
		default:{}
	},
	folderId:{
		type:String,
		unique:true,
		required:[true,"I need a ID"]
	},
	},
	{
		timestamps:true,
	}
);


module.exports = mongoose.model("Folder",folderSchema)