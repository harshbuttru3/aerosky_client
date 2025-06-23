'use client'

import {getAllUsers,getAllPilots} from '../utils/ApiRoutes';
import {BsThreeDotsVertical} from 'react-icons/bs';
import {useState,useEffect} from 'react';
import axios from 'axios';
import {HiLocationMarker} from 'react-icons/hi';
import {AiOutlineRight} from 'react-icons/ai';
import {LiaIndustrySolid} from 'react-icons/lia'
import Link from 'next/link';
import {useRecoilState} from 'recoil';
import {sideBarExtendState} from '../atoms/userAtom'



export default function UserManager() {
	// body...
	const [allUsers,setAllUsers] = useState([]);
	const [allPilots,setAllPilots] = useState([]);
	const [currentRoles,setCurrentRoles] = useState([]);
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);


	const roles = [
		'Admin',
		'Team',
		'Pilot',
		'Client',
		'Super Admin',
		'User'
	]

	const getAllUsersFunc = async() => {
		const {data} = await axios.post(getAllUsers,{
			key:"Wq1t9EDJVFfPXJXxjtL577/jETBDoUKeSz2KfclReCw="
		})
		if(data?.status){
			setAllUsers(data?.user);
			checkForRoles(data?.user);
			console.log(data?.user)
		}else{
			console.log(data?.msg);
		}
	}

	const getAllPilotsFunc = async() => {
		const {data} = await axios.post(getAllPilots,{
			key:"Wq1t9EDJVFfPXJXxjtL577/jETBDoUKeSz2KfclReCw="
		})
		console.log(data)
		if(data?.status){
			setAllPilots(data?.pilot);
			console.log(data?.user)
		}else{
			console.log(data?.msg);
		}
	}

	const checkForRoles = async(users) => {
		const resultRoles = [];
		for(const user of users){
			for(const role of user.roles){
				if(!resultRoles.includes(role)){
					resultRoles.push(role)
				}
			}
		}
		setCurrentRoles(resultRoles)
	}

	useEffect(()=>{
		getAllUsersFunc();
		getAllPilotsFunc();
	},[])

	function isValueIncludedCaseInsensitive(array, value) {
	    return array.some(item => item.toLowerCase() === value.toLowerCase());
	}


	return (
		<div className="md:px-8 px-3 py-5">
			<div className="flex flex-col gap-3">
				<h1 className="text-lg font-semibold text-black">My team</h1>
				<div className="grid md:grid-cols-3 grid-cols-2 mb-2 gap-4">
					<div className="flex flex-col gap-1 bg-white px-5 py-3 rounded-md border-[1px] 
					border-gray-400/30 shadow-lg shadow-gray-300/30 hover:border-sky-400 transition-all 
					duration-200 ease-in-out hover:shadow-sky-300/20 hover:scale-[102%] hover:bg-gradient-to-r from-white to-sky-200/30">
						<div className="flex justify-between items-center w-full">
							<h1 className="text-md font-semibold text-black">Total team members</h1>
							<div className="rounded-full cursor-pointer p-2 hover:bg-gray-200/30 transition-all duration-100 
							ease-in-out">
								<BsThreeDotsVertical className="h-4 w-4 text-gray-700"/>
							</div>	
						</div>
						<h1 className="text-2xl font-semibold text-blue-600">11</h1>
					</div>
					<div className="flex flex-col gap-1 bg-white px-5 py-3 rounded-md border-[1px] 
					border-gray-400/30 shadow-lg shadow-gray-300/30 hover:border-sky-400 transition-all 
					duration-200 ease-in-out hover:shadow-sky-300/20 hover:scale-[102%] hover:bg-gradient-to-r from-white to-sky-200/30">
						<div className="flex justify-between items-center w-full">
							<h1 className="text-md font-semibold text-black">Total clients</h1>
							<div className="rounded-full cursor-pointer p-2 hover:bg-gray-200/30 transition-all duration-100 
							ease-in-out">
								<BsThreeDotsVertical className="h-4 w-4 text-gray-700"/>
							</div>	
						</div>
						<h1 className="text-2xl font-semibold text-blue-600">11</h1>
					</div>
				</div>

				{
					currentRoles.map((role,j)=>(
						<div key={j} className="w-full">
							<h1 className="text-md font-semibold text-black">{role}s</h1>
							<div className="py-2 flex items-center gap-3 w-full overflow-hidden relative">
								<div className="absolute right-0 h-full bg-gradient-to-l from-gray-50 to-transparent px-2">
									<div className="h-full w-full flex items-center	justify-center">
										<Link href={`/Usermanagement/${role}`}><div className="p-2 rounded-full bg-white hover:scale-[105%] 
										cursor-pointer transition-all ease-in-out duration-100 border-[1px] border-gray-400/30 hover:shadow-md ">
											<AiOutlineRight className="text-black h-5 w-5"/>
										</div></Link>
									</div>
								</div>
								{
									allUsers.map((user,k)=>{
									if(!isValueIncludedCaseInsensitive(user?.roles, role)) return;
									return(
										<div key={k} className={`bg-white md:w-[30%] w-[45%]
										flex justify-between px-2 py-2  
										overflow-hidden rounded-md cursor-pointer border-[1px] border-gray-400/30 
										hover:shadow-md`}>
											<div className='flex flex-col gap-1 px-1 overflow-hidden'>
												<h2 className="text-md font-normal text-black whitespace-nowrap truncate">{user?.name}</h2>
												<h2 className="text-xs mt-1 font-normal text-gray-600 flex gap-[2px] items-center whitespace-nowrap truncate">
												<LiaIndustrySolid className="h-4 w-4"/>{user?.clientIndustry}</h2>
											</div>
											<img src={user?.image} alt="" className="h-14 rounded-md w-14 aspect-square"/>
										</div>
									)})
								}
							</div>
						</div>
					))
				}
				{
					allPilots?.length > 0 &&
					<div className="w-full">
						<h1 className="text-md font-semibold text-black">Pilots</h1>
						<div className="py-2 flex items-center gap-3 w-full overflow-hidden relative">
							<div className="absolute right-0 h-full bg-gradient-to-l from-gray-50 to-transparent px-2">
								<div className="h-full w-full flex items-center	justify-center">
									<Link href={`/Usermanagement/pilot`}><div className="p-2 rounded-full bg-white hover:scale-[105%] 
									cursor-pointer transition-all ease-in-out duration-100 border-[1px] border-gray-400/30 hover:shadow-md ">
										<AiOutlineRight className="text-black h-5 w-5"/>
									</div></Link>
								</div>
							</div>
							{
								allPilots.map((user,z)=>{
								return(
									<div key={z} className={`bg-white md:w-[30%] w-[45%]
									flex justify-between px-2 py-2  
									overflow-hidden rounded-md cursor-pointer border-[1px] border-gray-400/30 
									hover:shadow-md`}>
										<div className='flex flex-col gap-1 px-1 overflow-hidden'>
											<h2 className="text-md font-normal text-black whitespace-nowrap truncate">{user?.name}</h2>
											<h2 className="text-xs mt-1 font-normal text-gray-600 flex gap-[2px] items-center whitespace-nowrap truncate">
											<HiLocationMarker className="h-4 w-4"/>{user?.location}</h2>
										</div>
										<img src={user?.image} alt="" className="h-14 rounded-md w-14 aspect-square"/>
									</div>
								)})
							}
						</div>
					</div>
				}
			</div>
		</div>

	)
}