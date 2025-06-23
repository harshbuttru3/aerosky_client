

const mongoose = require('mongoose')
		
const batterySchema	=  new mongoose.Schema({
	batteryId:{
		type: String,
		required: true,
		max:40,
	},
	modelName:{
		type:String,
		default:'',
		required:true,
	},
	image:{
		type:String,
		default:'',
		required:true
	},
	serialId:{
		type:String,
		default:'',
		required:true
	},
	status:{
		type:String,
		default:'',
		required:true
	},
	purchaseDate:{
		type:String,
		default:'',
		required:true
	},
	remarks:{
		type:String,
		default:'',
		required:true
	},
	lastPilot:{
		type:String,
		default:'',
	},
	lastUsed:{
		type:String,
		default:'',
	},
	dischargeCycles:{
		type:String,
		default:'',
		required:true
	},
	userId:{
		type:String,
		default:''
	},
	pilotBattery:{
		type:Boolean,
		default:false
	},
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("Battery",batterySchema)
