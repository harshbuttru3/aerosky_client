const mongoose = require('mongoose')


const fileSchema = new mongoose.Schema({
	url:{
		type:String,
		required:[true,"I need url"]
	},
	name:{
		type:String,
		required:[true,"I need name"]
	},
	fileDat:{
		type:Object,
		default:{}
	},
	exif_data:{
		type:Object,
		default:{}
	},
	folderId:{
		type:String,
		required:[true,"I need folder id"]
	},
	tags:{
		type:Array,
		default:[]
	},
	annotations:{
		type:Object,
		default:{}
	}
	},
	{
		timestamps:true,
	}
);


module.exports = mongoose.model("File",fileSchema)