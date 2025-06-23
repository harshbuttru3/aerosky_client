const mongoose = require('mongoose')
		
const TagGroupSchema =  new mongoose.Schema({
	name:{
		type: String,
		required: true,
		max:40,
	},
	tags:{
		type:Array,
		required:[]
	},
	projectId:{
		type:String,
		required:true
	},
	createdUser:{
		type:String,
		required:true
	},
	
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("TagGroup",TagGroupSchema)

