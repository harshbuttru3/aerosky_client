const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema({
	message:{
		text:{
			type:String,
			default:'',
		},
		image:{
			type:String,
			default:''
		}
	},
	users: Array,
	seenBy: {
		type:Array,
		default:[]
	},
	senderImage:{
		type:String,
		default:''
	},
	sender:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true,
		},
	},
	{
		timestamps:true,
	}
);


module.exports = mongoose.model("Messages",messageSchema)