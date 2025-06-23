"use client"

import {useState,useEffect} from 'react'
import {IoMdClose} from 'react-icons/io';
import ImageKit from "imagekit";
import {AiOutlineCamera} from 'react-icons/ai'
import {editBatteryRoute} from '../../utils/ApiRoutes';
import Image from 'next/image';
import axios from 'axios';



export default function EditBattery({currentBattery,setCurrentBattery,
	openCurrentBatteryTab,setOpenCurrentBatteryTab,fetchBatteries}) {

	const [loading,setLoading] = useState(false);
	const [path,setPath] = useState('');
	const [url,setUrl] = useState('');
	const [serialId,setSerialId] = useState('');
	const [modelName,setModelName] = useState('');
	const [batteryId,setBatteryId] = useState('');
	const [dischargeCycles,setDischargeCycles] = useState('0');
	const [remarks,setRemarks] = useState('');
	const [purchaseDate,setPurchaseDate] = useState('');
	const [status,setStatus] = useState('Available');
	const [image,setImage] = useState('');
	const [editBattery,setEditBattery] = useState(false);


	var imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	const pathCheck = (path) =>{
		if(path){
			if(path.split('.').includes('jpg')){
				return true;
			}else if(path.split('.').includes('jpeg')){
				return true;
			}else if(path.split('.').includes('png')){
				return true;
			}
		}
	}

	const urlSetter = async(pathImage) => {
		const image_input = document.querySelector('#file1');
		if(image_input && pathCheck(pathImage)){
		const reader = new FileReader();
	
		reader.addEventListener('load',()=>{
			let uploaded_image = reader.result;
			setUrl(uploaded_image);		
		});
		reader.readAsDataURL(image_input.files[0]);
		}
	}

	useEffect(()=>{
		if(currentBattery){
			setEditBattery(false);
			setUrl(currentBattery?.image);
			setModelName(currentBattery?.modelName);
			setSerialId(currentBattery?.serialId);
			setDischargeCycles(currentBattery?.dischargeCycles);
			setStatus(currentBattery?.status);
			setPurchaseDate(currentBattery?.purchaseDate);
			setRemarks(currentBattery?.remarks);
			setBatteryId(currentBattery?.batteryId);
		}
	},[currentBattery])

	useEffect(()=>{
		if(editBattery){
			document.getElementById('batteryId-input').focus()
		}
	},[editBattery])

	const upload = () =>{
		if(url.length > 2){
			if(pathCheck(path)){
				setLoading(true)
				// e.preventDefault();
				imagekit.upload({
			    file : url, //required
			    fileName : "thejashari",   //required
			    extensions: [
			        {
			            name: "google-auto-tagging",
			            maxTags: 5,
			            minConfidence: 95
			        }
			    ]
				}).then(response => {
				    setImage(response.url);
				    editBatteryNow(response.url);
				}).catch(error => {
				    console.log(error.message);
				});
			}else{
				console.log('Please Select an Image');
			}  
		}
	}

	const editBatteryNow = async(image) => {
		const {data} = await axios.post(editBatteryRoute,{
			serialId,
			modelName,
			image,
			batteryId,
			dischargeCycles,
			remarks,
			purchaseDate,
			status,
			id:currentBattery?._id,
			key:'ltejb+kh8w=='
		})
		if(data.status){
			setLoading(false);
			setSerialId('');setBatteryId('');setRemarks('');setRemarks('');
			setImage('');setUrl('');setPurchaseDate('');setModelName('');
			setOpenCurrentBatteryTab(false);
			fetchBatteries();
		}else{
			setLoading(false);
			console.log(data.msg);
		}
	}

	const checkDetails = async(e) => {
		e.preventDefault()
		if(serialId.length > 2 && modelName.length > 3  && dischargeCycles.length > 0
			&& purchaseDate.length > 2 && url.length > 3){
			setLoading(true);
			if(url !== currentBattery?.image){
				upload();
			}else{
				editBatteryNow(currentBattery?.image);
			}	
		}else{
			alert("Please enter all the required fields")
		}
	}

	return (
		<div className={`fixed flex items-center justify-center top-0 ${openCurrentBatteryTab ? 'left-0' : '-left-[100%]'} 
		transition-all duration-200 ease-in-out  bg-white/60 z-50 h-full w-full`}>		
			<div className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-lg overflow-y-auto border-[1px] border-gray-400/50 bg-white flex flex-col">
				<div className={`${!loading && 'hidden' } fixed left-0 top-0 z-50 h-full w-full flex items-center justify-center bg-white/50`}>
					<span class="loader"></span>
				</div>
				<div className="flex sticky top-0 bg-white py-1 backdrop-blur-lg items-center 
				border-b-[1px] border-gray-300 gap-5 px-2">
					<div 
					onClick={()=>{
						setOpenCurrentBatteryTab(false);
						setEditBattery(false);
						setTimeout(()=>{setCurrentBattery('')},1000)
					}}	
					className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full">
						<IoMdClose className="h-5 w-5 cursor-pointer text-black "/>
					</div>
					<h1 className="text-xl select-none text-black  font-semibold">{editBattery ? 'Edit ' : ''}Battery</h1>
				</div>
				<form className="flex flex-col mt-3 px-4">
					<div className="flex gap-2">
						<div className="flex p-2 flex-col gap-2">
							<h1 className="text-md font-semibold text-black">Upload avatar</h1>
							<div 
							onClick={()=>document.getElementById('file1').click()}
							className="h-[150px] w-[150px] hover:border-sky-700 transition-all duration-200
							ease-in-out flex items-center justify-center cursor-pointer border-dashed
							rounded-md border-[1.5px] border-sky-600 p-[2px] overflow-hidden">
								<input type="file" id="file1" accept="image/*" 
								value={path} disabled={!editBattery}
								onChange={(e)=>{setPath(e.target.value);urlSetter(e.target.value)}}
								hidden
								/>
								<Image src={url ? url : "https://ik.imagekit.io"}
								width="20000" height="10" object="cover" alt="" className={`rounded-md ${!url && 'hidden'}`}/>
								<AiOutlineCamera className="h-14 w-14 text-sky-500"/>
							</div>
						</div>
						<div className="flex px-3 w-full py-2 border-l-[1px] border-gray-300 flex-col gap-2">
							<h1 className="text-md font-semibold text-black">Battery details</h1>
							<div className="flex flex-col gap-1">
								<h1 className="text-sm text-gray-700 font-semibold">Battery ID <span className="text-red-500">*</span></h1>
								<div className="px-3 py-2 border-[1px] hover:border-gray-800 focus-within:border-gray-800 border-gray-600/60 rounded-lg">
									<input type="text" disabled={!editBattery}
									placeholder="Enter battery id" id="batteryId-input"
									value={batteryId} onChange={(e)=>setBatteryId(e.target.value)}
									className="outline-none bg-transparent text-sm 
									placeholder:text-gray-500 text-black"
									/>
								</div>	
							</div>
							<div className="flex flex-col gap-1">
								<h1 className="text-sm text-gray-700 font-semibold">Model name <span className="text-red-500">*</span></h1>
								<div className="px-3 py-2 border-[1px] hover:border-gray-800 focus-within:border-gray-800 border-gray-600/60 rounded-lg">
									<input type="text" disabled={!editBattery}
									placeholder="Enter model name"	
									value={modelName} onChange={(e)=>setModelName(e.target.value)}
									className="outline-none bg-transparent text-sm 
									placeholder:text-gray-500 text-black"
									/>
								</div>	
							</div>
						</div>
					</div>

					<div className="px-3 grid md:grid-cols-2 grid-cols-1 gap-3">
						<div className="flex flex-col gap-1">
							<h1 className="text-sm text-gray-700 font-semibold">Serial ID <span className="text-red-500">*</span></h1>
							<div className="px-3 py-2 border-[1px] hover:border-gray-800 focus-within:border-gray-800 border-gray-600/60 rounded-lg">
								<input type="text" disabled={!editBattery}
								placeholder="Enter Serial ID"	
								value={serialId} onChange={(e)=>setSerialId(e.target.value)}
								className="outline-none bg-transparent text-sm 
								placeholder:text-gray-500 text-black"
								/>
							</div>	
						</div>
						<div className="flex flex-col gap-1">
							<h1 className="text-sm text-gray-700 font-semibold">Discharge cycles <span className="text-red-500">*</span></h1>
							<div className="px-3 py-2 border-[1px] hover:border-gray-800 focus-within:border-gray-800 border-gray-600/60 rounded-lg">
								<input type="text" disabled={!editBattery}
								placeholder="Enter Discharge cycles"	
								value={dischargeCycles} onChange={(e)=>setDischargeCycles(e.target.value)}
								className="outline-none bg-transparent text-sm 
								placeholder:text-gray-500 text-black"
								/>
							</div>	
						</div>
						<div className="flex flex-col gap-1">
							<h1 className="text-sm text-gray-700 font-semibold">Drone status <span className="text-red-500">*</span></h1>
							<div className="px-3 py-2 border-[1px] hover:border-gray-800 focus-within:border-gray-800 border-gray-600/60 rounded-lg">
								<select value={status} onChange={(e)=>setStatus(e.target.value)} disabled={!editBattery}
								className="w-full ring-0 outline-none" >
									<option value="Available">Available</option>
									<option value="Not Available">Not Available</option>
								</select>
							</div>	
						</div>
						<div className="flex flex-col gap-1">
							<h1 className="text-sm text-gray-700 font-semibold">Purchase date <span className="text-red-500">*</span></h1>
							<div className="px-3 py-2 border-[1px] hover:border-gray-800 focus-within:border-gray-800 border-gray-600/60 rounded-lg">
								<input type="date" disabled={!editBattery}
								placeholder="Enter Discharge cycles"	
								value={purchaseDate} onChange={(e)=>setPurchaseDate(e.target.value)}
								className="outline-none bg-transparent text-sm 
								placeholder:text-gray-500 text-black w-full"
								/>
							</div>	
						</div>	
					</div>
					<div className="mt-2 px-3">
						<div className="flex flex-col gap-1">
							<h1 className="text-sm text-gray-700 font-semibold">Remarks</h1>
							<div className="px-3 py-2 border-[1px] hover:border-gray-800 focus-within:border-gray-800 border-gray-600/60 rounded-lg">
								<textarea type="text" 
								placeholder="Enter the remarks"	disabled={!editBattery}
								value={remarks} onChange={(e)=>setRemarks(e.target.value)}
								className="outline-none resize-none bg-transparent text-sm 
								placeholder:text-gray-500 text-black w-full h-[100px]"
								/>
							</div>	
						</div>
					</div>


					<div className="h-[1px] w-full bg-gray-300 mt-3"/>
					<div className="px-3">
						{
							editBattery ? 
							<button 
							onClick={(e)=>{e.preventDefault();setEditBattery(false);checkDetails(e)}}
							className={`text-white py-3 mb-3 px-5 mt-3 hover:scale-[102%] transition-all 
							duration-200 w-full ease-in-out rounded-lg bg-blue-700 `}>
								Save
							</button>
							:
							<button 
							onClick={(e)=>{e.preventDefault();setEditBattery(true);
								let ele = document.getElementById('batteryId-input');
								ele.scrollIntoView({
									behavior: "smooth", 
									block: "start"
								});
							}}
							className={`text-black py-3 mb-3 px-5 mt-3 hover:scale-[102%] transition-all 
							duration-200 w-full ease-in-out rounded-lg bg-gray-100 hover:bg-gray-200 border-[1px] border-gray-800 `}>
								Edit battery
							</button>
						}
					</div>
				</form>
			</div>
		</div>

	)
}