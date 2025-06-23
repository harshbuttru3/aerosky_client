

const mongoose = require('mongoose')
		
const processingTeamSchema =  new mongoose.Schema({
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
		default:'https://www.pngkey.com/png/full/73-730477_first-name-profile-image-placeholder-png.png',
	},
	number:{
		type:String,
		default:''
	},
	location:{
		type:String,
		default:''
	},
	password:{
		type:String,
		required:true
	},
	previousWorkExperience:{
		type:String,
		default:''
	},
	roles:{
		type:Array,
		default:['processingTeam']
	},
	status:{
		type:String,
		default:'Available'
	},
	aadharPdf:{
		type:String,
		default:'-None-'
	},
	aadharNumber:{
		type:String,
		default:'-None-'
	},
	district:{
		type:String,
		default:'-None-'
	},
	state:{
		type:String,
		default:'-None-'
	},
	experience:{
		type:String,
		default:'-None-'
	},
	haveDCGACertificate:{
		type:String,
		default:'-None-'
	},
	skills:{
		type:Array,
		default:[]
	},
	assignedProjects:{
		type:Array,
		default:[]
	},
	},
	{
		timestamps:true,
	}
)


module.exports = mongoose.model("ProcessingTeam",processingTeamSchema)



