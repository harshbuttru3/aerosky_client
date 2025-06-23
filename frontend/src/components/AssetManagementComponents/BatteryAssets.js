"use client"

import React from "react";
import {useState,useEffect} from 'react';
import {FiMenu} from 'react-icons/fi';
import {AiOutlineSearch} from 'react-icons/ai' 
import {IoMdClose} from 'react-icons/io';
import {AiOutlineCamera} from 'react-icons/ai';
import {BsFillPersonFill} from 'react-icons/bs';
import Image from 'next/image';
import ImageKit from "imagekit";
import {getBattery,createBattery} from '../../utils/ApiRoutes';
import axios from 'axios'
import EditBattery from './EditBattery';



export default function BatteryAssets() {
	// body...
	const [batteries,setBatteries] = useState('');
	const [openBatteryCreateTab,setOpenBatteryCreateTab] = useState(false);
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
	const [currentBatteries,setCurrentBatteries] = useState([]);
	const [currentBattery,setCurrentBattery] = useState('');
	const [openCurrentBatteryTab,setOpenCurrentBatteryTab] = useState(false);

	var imagekit = new ImageKit({
	    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_ID,
	    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE,
	    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT
	});

	useEffect(()=>{fetchBatteries()},[])

	const fetchBatteries = async() => {
		const {data} = await axios.post(getBattery,{key:"ltejb+kh8w=="});
		if(data?.status){
			setCurrentBatteries(data.battery);
			console.log(data.battery)
		}else{
			console.log(data?.msg)
		}
	}

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
				    createBatteryNow(response.url);
				}).catch(error => {
				    console.log(error.message);
				});
			}else{
				console.log('Please Select an Image');
			}  
		}
	}

	const createBatteryNow = async(image) => {
		const {data} = await axios.post(createBattery,{
			serialId,
			modelName,
			image,
			batteryId,
			dischargeCycles,
			remarks,
			purchaseDate,
			status,
			key:'ltejb+kh8w=='
		})
		if(data.status){
			setLoading(false);
			setSerialId('');setBatteryId('');setRemarks('');setRemarks('');
			setImage('');setUrl('');setPurchaseDate('');setModelName('');
			setOpenBatteryCreateTab(false);
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
			upload();
		}else{
			alert("Please enter all the required fields")
		}
	}
 
	return (
		<div className="w-full md:px-8 px-2">
			<EditBattery currentBattery={currentBattery} setCurrentBattery={setCurrentBattery} 
			openCurrentBatteryTab={openCurrentBatteryTab} setOpenCurrentBatteryTab={setOpenCurrentBatteryTab}
			fetchBatteries={fetchBatteries}
			/>
			<div className={`fixed flex items-center justify-center top-0 ${openBatteryCreateTab ? 'left-0' : '-left-[100%]'} 
			transition-all duration-200 ease-in-out  bg-white/60 z-50 h-full w-full`}>		
				<div className="relative m-auto lg:w-[40%] md:w-[60%] sm:w-[80%] sm:max-h-[85%] h-full w-full sm:rounded-lg overflow-y-auto border-[1px] border-gray-400/50 bg-white flex flex-col">
					<div className={`${!loading && 'hidden' } fixed left-0 top-0 z-50 h-full w-full flex items-center justify-center bg-white/50`}>
						<span class="loader"></span>
					</div>
					<div className="flex sticky top-0 bg-white py-1 backdrop-blur-lg items-center 
					border-b-[1px] border-gray-300 gap-5 px-2">
						<div 
						onClick={()=>{
							setOpenBatteryCreateTab(false)
						}}	
						className="p-2 hover:bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out rounded-full">
							<IoMdClose className="h-5 w-5 cursor-pointer text-black "/>
						</div>
						<h1 className="text-xl select-none text-black  font-semibold">Add battery</h1>
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
									value={path}
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
										<input type="text" 
										placeholder="Enter battery id"
										value={batteryId} onChange={(e)=>setBatteryId(e.target.value)}
										className="outline-none bg-transparent text-sm 
										placeholder:text-gray-500 text-black"
										/>
									</div>	
								</div>
								<div className="flex flex-col gap-1">
									<h1 className="text-sm text-gray-700 font-semibold">Model name <span className="text-red-500">*</span></h1>
									<div className="px-3 py-2 border-[1px] hover:border-gray-800 focus-within:border-gray-800 border-gray-600/60 rounded-lg">
										<input type="text" 
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
									<input type="text" 
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
									<input type="text" 
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
									<select value={status} onChange={(e)=>setStatus(e.target.value)} 
									className="w-full ring-0 outline-none" >
										<option value="Available">Available</option>
										<option value="Not Available">Not Available</option>
									</select>
								</div>	
							</div>
							<div className="flex flex-col gap-1">
								<h1 className="text-sm text-gray-700 font-semibold">Purchase date <span className="text-red-500">*</span></h1>
								<div className="px-3 py-2 border-[1px] hover:border-gray-800 focus-within:border-gray-800 border-gray-600/60 rounded-lg">
									<input type="date" 
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
									placeholder="Enter the remarks"	
									value={remarks} onChange={(e)=>setRemarks(e.target.value)}
									className="outline-none bg-transparent text-sm 
									placeholder:text-gray-500 text-black w-full h-[100px]"
									/>
								</div>	
							</div>
						</div>


						<div className="h-[1px] w-full bg-gray-300 mt-3"/>

						<button 
						onClick={(e)=>checkDetails(e)}
						className={`text-white py-3 mb-3 px-5 mt-3 hover:scale-[102%] transition-all 
						duration-200 ease-in-out rounded-lg bg-blue-700 `}>
							Add battery
						</button>
					</form>
				</div>
			</div>
			<div className="w-full mt-1 p-3 px-4 bg-gray-200/60 rounded-lg flex flex-col">
				<div className="flex md:items-center md:flex-row flex-col justify-between gap-3 w-full">
					<div className="flex items-center gap-2 md:w-[70%] w-[100%] bg-white p-2 rounded-md">
						<AiOutlineSearch className="h-5 w-5 text-gray-700"/>
						<input type="text" className="w-full outline-none bg-transparent 
						ring-none text-md text-black placeholder:text-gray-600" 
						placeholder="Search battery"
						/>
					</div>
					<div className="flex items-center gap-3">
						<button onClick={()=>setOpenBatteryCreateTab(true)}
						className="bg-blue-600 text-white px-8 py-2 hover:scale-105 transition-all
						duration-200 ease-in-out shadow-md shadow-gray-500/40 rounded-md">Add Battery</button>
						<button className="bg-blue-600 text-white p-2 hover:scale-105 transition-all
						duration-200 ease-in-out shadow-md shadow-gray-500/40 rounded-md">
							<FiMenu className="h-5 w-5 text-white"/>
						</button>
					</div>
				</div>

				<h1 className="mt-4 text-black font-semibold text-lg">Available batteries ({batteries?.length})</h1>

				<div className="w-full overflow-y-auto bg-white mt-2 rounded-lg border-[1px] border-gray-400/40">
					<table className="w-full px-1 ">
						<thead className="w-full cursor-pointer hover:bg-sky-200/30 transition-all 
						border-b-[1px] border-gray-300/50 duration-100 ease-in-out" >
							<tr className="w-full" >
								<td className="px-5 whitespace-nowrap py-5" ></td>
								<td className="px-5 whitespace-nowrap py-5 text-sm text-center">Serial ID</td>
								<td className="px-5 whitespace-nowrap py-5 text-sm text-center">Battery ID</td>
								<td className="px-5 whitespace-nowrap py-5 text-sm text-center">Model name</td>
								<td className="px-5 whitespace-nowrap py-5 text-sm text-center">Purchase date</td>
								<td className="px-5 whitespace-nowrap py-5 text-sm text-center">Status</td>
								<td className="px-5 whitespace-nowrap py-5 text-sm text-center">Discharge cycles</td>
								<td className="px-5 whitespace-nowrap py-5 text-sm text-center">Last pilot</td>
								<td className="px-5 whitespace-nowrap py-5 text-sm text-center">Last used</td>
								<td className="px-5 whitespace-nowrap py-5 text-sm text-center">Remarks</td>
							</tr>

						</thead>
						<tbody>
							{
								currentBatteries.map((battery,j)=>(
									<tr 
									onClick={()=>{setCurrentBattery(battery);setOpenCurrentBatteryTab(true)}}
									className="w-full border-b-[1px] border-gray-300/50 hover:bg-gray-200/30 
									cursor-pointer transition-all duration-100 ease-in-out" key={j} >
										<td className="px-1 whitespace-nowrap py-5" >
											<img src={battery?.image} className=" w-full cursor-pointer"/>
										</td>
										<td className="px-5 whitespace-nowrap py-5 text-sm text-center">{battery?.serialId}</td>
										<td className="px-5 whitespace-nowrap py-5 text-sm text-center">{battery?.batteryId}</td>
										<td className="px-5 whitespace-nowrap py-5 text-sm text-center">{battery?.modelName}</td>
										<td className="px-5 whitespace-nowrap py-5 text-sm text-center">{battery?.purchaseDate}</td>
										<td className="px-2 whitespace-nowrap py-3 text-sm text-center">{
											battery?.status === 'Available' ? 
											<button className="rounded-full bg-green-600 text-white px-3 py-2">
												Available
											</button>
											:
											<button className="rounded-full bg-red-600 text-xs text-white px-3 py-2">
												Unavailable
											</button>
										}</td>
										<td className="px-5 whitespace-nowrap py-5 text-sm text-center">{battery?.dischargeCycles}</td>
										<td className="px-5 whitespace-nowrap py-5 text-sm text-center">{
											battery?.lastPilot === '' ? '~' : battery?.lastPilot
										}</td>
										<td className="px-5 whitespace-nowrap py-5 text-sm text-center">{
											battery?.lastUsed === '' ? '~' : battery?.lastUsed
										}</td>
										<td className="px-5 whitespace-nowrap py-5 text-sm text-center truncate">{
											battery?.remarks === '' ? '~' : (battery?.remarks?.length > 10 ? battery?.remarks.substring(0,10) + '...' : battery?.remarks)
										}</td>
									</tr>		
								))
							}

						</tbody>						
					</table>
				</div>
			</div>

		</div>

	)
}

// {
// 							currentWorkshop?.datesAndTimings?.map((dat,i)=>(
// 								<tbody key={i} className={`border-y-[1px] ${i%2 === 0 && 'bg-black/10' } border-gray-400/40 cursor-pointer hover:bg-sky-200/30 transition-all duration-100 ease-in-out`}>
// 									<td className="px-7 py-2" >{dat?.split('(')[0]}</td>
// 									<td className="px-7 py-2" >{dat?.split('(')[1]?.split(')')[0]?.split(':')[1]}</td>
// 								</tbody>
// 							))
// 						}