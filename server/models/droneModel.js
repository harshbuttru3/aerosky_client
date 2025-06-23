

const mongoose = require('mongoose')
		
const droneSchema = new mongoose.Schema({
	name:{
		type: String,
		required: true,
		max:40,
	},
	id:{
		type:String,
		default:'',
		required:true,
	},
	status:{
		type:String,
		default:'Available'
	},
	image:{
		type:String,
		default:'',
	},
	ownerName:{
		type:String,
		default:''
	},
	userId:{
		type:String,
		default:''
	},
	pilotDrone:{
		type:Boolean,
		default:false
	}
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("Drone",droneSchema)




