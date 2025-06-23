const AccessRequest = require("../models/accessRequestModel");


module.exports.createAccessRequest = async(req,res,next) => {
	try{
		const {name,email,number,oraganizationType,organizationName,
		organizationId,clientIndustry} = req.body;
		const request = await AccessRequest.create({
			name,email,number,oraganizationType,organizationName,
			organizationId,clientIndustry
		})
		if(request){
			return res.json({status:true,msg:'Okay'})
		}
		return res.json({status:false,msg:"Something went wrong"})
	}catch(ex){
		next(ex)
	}
}

module.exports.getAccessRequest = async(req,res,next) => {
	try{
		const {token} = req.body;
		if(token === '1jn/BmBe3qYxzGiyxfsiMQ=='){
			try{
				const request = await AccessRequest.find();
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

module.exports.deleteRequest = async(req,res,next) => {
	try{
		const {id,key} = req.body;
		if(key === 'LAvp8i8SDqeMnZMQam+KgGv6IVTWuYOkxHZa488j5no='){
			const result = await AccessRequest.findByIdAndRemove(id);
			console.log(result);
		    if(result){
				return res.json({status:true,msg:"Request was deleted successfully!"})
		    }
			return res.json({status:false,msg:"Can't delete the request!"})
		}else{
			return res.json({status:false,msg:"Invalid key!"})
		}
	}catch(ex){
		next(ex)
	}
}