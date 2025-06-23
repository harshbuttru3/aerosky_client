



const mongoose = require('mongoose')
		
const emailVerifySchema = new mongoose.Schema({
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
	number:{
		type:String,
		default:''
	},
	organizationType:{
		type:String,
		required:true
	},
	organizationName:{
		type:String,
		required:true
	},
	organizationId:{
		type:String,
		required:true
	},
	token:{
		type:String,
		required:true
	},
	clientIndustry:{
		type:Array,
		required:true
	}
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("EmailVerify",emailVerifySchema)



