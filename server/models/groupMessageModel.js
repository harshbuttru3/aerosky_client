const mongoose = require('mongoose')


const groupMessageSchema = new mongoose.Schema({
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
	groupId:{
		type:String,
		required:true
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


module.exports = mongoose.model("groupMessages",groupMessageSchema)