



const mongoose = require('mongoose')
		
const accessRequestSchema = new mongoose.Schema({
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
		default:'https://ik.imagekit.io/d3kzbpbila/thejashari_cktnTcxvv?updatedAt=1694788139311',
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
	clientIndustry:{
		type:Array,
		required:true
	}
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("AccessRequest",accessRequestSchema)



