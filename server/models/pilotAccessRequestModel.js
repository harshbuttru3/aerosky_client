

const mongoose = require('mongoose')
		
const pilotAccessRequestSchema =  new mongoose.Schema({
	name:{
		type: String,
		required: true,
		max:40,
	},
	email:{
		type:String,
		default:'',
		required:true,
		unique:true
	},
	image:{
		type:String,
		default:'',
	},
	number:{
		type:String,
		default:''
	},
	location:{
		type:String,
		default:''
	},
	previousWorkExperience:{
		type:String,
		default:''
	},
	roles:{
		type:Array,
		default:['pilot']
	}
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("PilotAccessRequest",pilotAccessRequestSchema)



