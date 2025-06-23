

const mongoose = require('mongoose')
		
const clientSchema	=  new mongoose.Schema({
	clientName:{
		type: String,
		required: true,
		max:40,
	},
	clientMail:{
		type:String,
		default:'',
		required:true,
		unique:true
	},
	clientImage:{
		type:String,
		default:'',
	},
	clientNumber:{
		type:String,
		default:''
	},
	projectName:{
		type:String,
		default:''
	}
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("Client",clientSchema)
