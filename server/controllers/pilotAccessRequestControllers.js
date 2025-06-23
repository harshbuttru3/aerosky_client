
const PilotAccessRequest = require('../models/pilotAccessRequestModel')


module.exports.getPilotAccessRequest = async(req,res,next) => {
	try{
		const {token} = req.body;
		if(token === 'j2y512vIRMyn9eJtfHykTw=='){
			try{
				const request = await PilotAccessRequest.find();
				if(request){
					return res.json({status:true,request})
				}
				return res.json({status:false,msg:"Request not found"})
			}catch(ex){
				return res.json({status:false,msg:"Something went wrong"})
			}
		}else{
			return res.json({status:false,msg:"Token mismatch"})
		}
	}catch(ex){
		next(ex)
	}
}

module.exports.deletePilotRequest = async(req,res,next) => {
	try{
		const {id} = req.body;
		const result = await PilotAccessRequest.findByIdAndRemove(id);
		console.log(result);
	    if(result){
			return res.json({status:true,msg:"Request was deleted successfully!"})
	    }
		return res.json({status:false,msg:"Can't delete the request!"})
	}catch(ex){
		next(ex)
	}
}