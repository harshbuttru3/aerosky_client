const mongoose = require('mongoose')
		
const projectRequestSchema =  new mongoose.Schema({
	name:{
		type: String,
		required: true,
		max:40,
	},
	projectLocation:{
		type:String,
		required:true,
	},
	startDate:{
		type:String,
		required:true
	},
	deadline:{
		required:true,
		type:String
	},
	scope:{
		type:String,
		required:true
	},
	industry:{
		type:String,
		required:true
	},
	type:{
		type:String,
		required:true
	},
	kmlkmzFiles:{
		type:Array,
		required:true
	},
	deliverablesRequired:{
		type:Array,
		default:[]
	},
	attachments:{
		type:Array,
		default:[]
	},
	status:{
		type:String,
		default:'Under review'
	},
	teamMembers:{
		type:Array,
		default:[]
	},
	clientDetails:{
		type:Object,
		required:true
	}
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("ProjectRequest",projectRequestSchema)



