"use client"

import {HiOutlineHome,HiOutlineUserGroup} from 'react-icons/hi';
import {FiUser} from 'react-icons/fi';
import {LuBox} from 'react-icons/lu';
import {TbSkateboarding,TbDrone} from 'react-icons/tb';
import {RiSettings3Line} from 'react-icons/ri';
import {SiSaturn} from 'react-icons/si';
import {MdOutlineManageAccounts} from 'react-icons/md';
import {AiOutlineMessage,AiOutlineRight} from 'react-icons/ai';
import {useState,useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {getUserById} from '../utils/ApiRoutes'
import {sideBarExtendState,currentTabState,openSideBarMobileState,
	tempDataState,currentUserState,arrivalMessageState,currentMainTabState,
	userRefetchTriggerState,currentChatState,
	messagesRefetchTriggerState} from '../atoms/userAtom'
import {useRouter} from 'next/navigation';
import  axios from 'axios'
import {socket} from '../service/socket';
import Link from 'next/link'
import {RxCross2} from 'react-icons/rx'; 
import {TbMap2} from 'react-icons/tb';
import VideoCall from './VideoCall';
import IncomingCallNotify from './IncomingCallNotify';

let inCall = false;
let inGroupCall = false;

export default function Sidebar({dragRef}) {

	const [currentTab,setCurrentTab] = useRecoilState(currentTabState);
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	const [currentChat,setCurrentChat] = useRecoilState(currentChatState);
	const router = useRouter();
	const [openSideBarMobile,setOpenSideBarMobile] = useRecoilState(openSideBarMobileState);
	const [tempData,setTempData] = useRecoilState(tempDataState);
	const [userRefetchTrigger,setUserRefetchTrigger] = useRecoilState(userRefetchTriggerState);
	const [messagesRefetchTrigger,setMessagesRefetchTrigger] = useRecoilState(messagesRefetchTriggerState)
 	const [arrivalMessage,setArrivalMessage] = useRecoilState(arrivalMessageState);
	const [currentMainTab,setCurrentMainTab] = useRecoilState(currentMainTabState);
 	const [acceptedCall,setAcceptedCall] = useState(false);
 	const [clientConnected,setClientConnected] = useState(false);
 	const [revealNotify,setRevealNotify] = useState('');
 	const [notify,setNotify] = useState(false)


	const menuItems = currentUser?.roles?.includes("processingTeamManager") ? [
	{
		icon:<HiOutlineHome className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/> ,
		menu:'Dashboard'
	},
	{
		icon:<MdOutlineManageAccounts className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/> ,
		menu:'Manage'
	},
	{
		icon:<LuBox className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out`}/>,
		menu:'Projects'
	},
	{
		icon:<AiOutlineMessage className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/>,
		menu:'message'
	},
	{
		icon:<RiSettings3Line className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/>,
		menu:'Settings'
	}
	] :  [
	{
		icon:<HiOutlineHome className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/> ,
		menu:'Dashboard'
	},
	{
		icon:<LuBox className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out`}/>,
		menu:'Projects'
	},
	{
		icon:<AiOutlineMessage className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/>,
		menu:'message'
	},
	{
		icon:<RiSettings3Line className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/>,
		menu:'Settings'
	}
	]

	useEffect(()=>{
		socket.on('msg-recieve',(newData)=>{
			setTempData(newData);	
			// console.log(newData)	
		});

		socket.on('user-refetch',(data)=>{
			setUserRefetchTrigger(true)
		})

		socket.on('messages-refetch',(data)=>{
			setMessagesRefetchTrigger(true);
		})	
		return ()=>{
			socket.off('msg-recieve');
			socket.off('user-refetch');
			socket.off('messages-refetch');
		}

	},[])

	useEffect(()=>{
		if(tempData){	
			if(tempData?.group){
				if(currentChat?.group){
					if(!currentChat?._id?.includes(tempData?.from)){
						sendNotify(tempData);	
					}else{
						setArrivalMessage(tempData);				
					}	
				}else{
					sendNotify(tempData);	
				}						
				setTempData('');				
			}else{
				if(currentChat._id!==tempData.from){
					sendNotify(tempData);
				}else{
					setArrivalMessage(tempData);				
				}						
				setTempData('');
			}
		}
	},[tempData])

	useEffect(()=>{
		if(currentUser && !clientConnected){
			setClientConnected(true)
			socket.emit('add-user',currentUser._id);
		}
	},[currentUser])

	const sendNotify = async(newData) => {
		// console.log(newData)
		const {data} = await axios.post(getUserById,{id:newData.from});
		const dat = {
			user:data.user,
			newData:newData
		}
		setNotify(true);
		setRevealNotify(dat);
		setTimeout(()=>{
			setNotify(false);
			setTimeout(()=>{
				setRevealNotify('');
			},400)
		},5000)
		const data2 = await axios.post(getUserById,{id:currentUser?._id});
		setCurrentUser(data2?.data?.user);
	}

	return(
		<main className={`${currentMainTab === 'map' ? 'w-[0%] overflow-hidden' : sideBarExtend ?  'sm:w-[19%] xs:w-[14%] w-[100%] xs:relative fixed' : 'w-[7%] relative'} 
		z-50 flex flex-col h-full bg-gray-100 pt-4 transition-all duration-300 ease-in-out 
		${openSideBarMobile ? 'top-0' :'xs:top-0 top-[100%]'} left-0 `}>
			<div onClick={()=>setSideBarExtend(!sideBarExtend)} className={`hidden xs:block absolute cursor-pointer ${currentMainTab === 'map' ? 'w-[0%] overflow-hidden' : sideBarExtend ? 'h-6 w-6 -right-3 top-14 p-1' : '-right-2 top-12 h-5 p-1 w-5'} rounded-full bg-blue-600`}>
				<AiOutlineRight className={`h-full w-full text-white ${sideBarExtend ? 'rotate-180' : 'rotate-0'} transition-all duration-300 ease-in-out `}/>
			</div>
			<div onClick={()=>setOpenSideBarMobile(false)}
			className="w-full flex xs:hidden items-center justify-center px-2 py-1">
				<div 
				className='h-1 w-[100px] bg-gray-300 hover:bg-blue-500 transition-all duration-100 
				ease-in-out rounded-full cursor-pointer'/>
			</div>

			<div className={`w-full ${sideBarExtend ? 'px-6': 'px-2'} transition-all duration-300 ease-in-out`}>
				<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_JxPo9zToO" alt="Logo" className="
				w-full"/>
			</div>
			<div className="mt-4 overflow-y-auto h-full w-full px-4  
			scrollbar-thumb-sky-500 py-2 flex flex-col gap-2 scrollbar-thin">
				{
					menuItems.map((item,j)=>(	
						<Link href={`/processingTeam/${item?.menu?.replace(' ','')}`}
						onClick={()=>{setCurrentTab(item.menu)}}
						className={`rounded-xl ${currentTab === item?.menu ? 'bg-gradient-to-l to-sky-500 from-sky-600 shadow-lg shadow-sky-80/10 ' : 'bg-transparent'} 
						p-2 flex items-center gap-3 hover:bg-gradient-to-l to-sky-500 from-sky-600 hover:shadow-lg hover:shadow-sky-80/10 cursor-pointer transition-all 
						group ${sideBarExtend ? 'md:justify-start xs:justify-center justify-start' : 'justify-center'} `} key={j} >
							<div className={`p-2 bg-white rounded-xl ${currentTab === item.menu ? 'text-sky-500' : 'text-black'} 
							group-hover:text-sky-500 shadow-lg group-hover:scale-[105%] transition-scale duration-100 ease-in-out `}>
								{item?.icon}
							</div>
							<h2 className={`lg:text-sm xs:text-xs text-sm break-text ${currentTab === item?.menu ? 'text-gray-200 font-semibold' : 'text-black' }
							group-hover:text-gray-200 ${sideBarExtend ? 'xs:hidden md:block' : 'sm:hidden'} group-hover:font-semibold block `}>{item?.menu}</h2>
						</Link>

					))
				}


			</div>
			<div onClick={()=>{
				router.push('/message');
				setNotify(false);
				setTimeout(()=>{
					setRevealNotify('');
				},400)
			}} className={`fixed flex gap-2 items-center px-4 pr-7 py-2 bottom-4 shadow-xl hover:shadow-sky-600/60 shadow-sky-600/40 ${notify ? 'right-5':'-right-[100%]'} 
			bg-gray-50 dark:bg-gray-900 z-50 rounded-xl transition-all duration-300 ease-in-out border-gray-300/60 dark:border-gray-700/60 border-[1.4px]`}>
				<img src={revealNotify?.user?.image}
				alt=" "
				className="h-9 w-9 rounded-full"/>
				<div className="flex flex-col">
					<h1 className="text-black dark:text-gray-200 hover:underline text-md font-semibold">
						{
							revealNotify?.user?.name.length > 20 ? 
							revealNotify?.user?.name.substring(0,17) + '...'
							:
							revealNotify?.user?.name
						}
					</h1>
					<h1 className="text-gray-600 dark:text-gray-400 md:text-md text-sm">{
						revealNotify?.newData?.message.length > 35 ?
						revealNotify?.newData?.message?.includes('Kml') ?
						<span className="flex items-center gap-1" ><TbMap2 className="text-sky-500 h-4 w-4"/> KML/KMZ</span>
						:
						revealNotify?.newData?.message.substring(0,30) + '...'	
						:
						revealNotify?.newData?.message

					}</h1>
				</div>
				<div className="absolute top-[5px] right-1">
					<div 
					onClick={()=>{
						setNotify(false);
						setTimeout(()=>{
							setRevealNotify('');
						},400)
					}}
					className="rounded-full cursor-pointer">
						<RxCross2 className="h-4 w-4 text-gray-800 dark:text-gray-200"/>
					</div>
				</div>

			</div>
			<VideoCall acceptedCall={acceptedCall} setAcceptedCall={setAcceptedCall} 
			inCall={inCall} inGroupCall={inGroupCall} dragRef={dragRef} />
			<IncomingCallNotify inCall={inCall} acceptedCall={acceptedCall} setAcceptedCall={setAcceptedCall}
			inGroupCall={inGroupCall}
			/>
 		</main>

	)
}