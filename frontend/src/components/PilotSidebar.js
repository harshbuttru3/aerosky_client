"use client"

// import {AiOutlineRight} from 'react-icons/ai';\
import {TbMap2} from 'react-icons/tb';
import {useRecoilState} from 'recoil';
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {BsFillCaretDownFill} from 'react-icons/bs';
import {HiOutlineHome,HiOutlineUserGroup} from 'react-icons/hi';
import {FiUser} from 'react-icons/fi';
import {LuBox} from 'react-icons/lu';
import {TbSkateboarding,TbDrone} from 'react-icons/tb';
import {RiSettings3Line} from 'react-icons/ri';
import {SiSaturn} from 'react-icons/si';
import {AiOutlineMessage,AiOutlineRight} from 'react-icons/ai';
import {HiOutlineLogout} from 'react-icons/hi';
import {sideBarExtendState,currentTabState,openSideBarMobileState,
	tempDataState,currentUserState,arrivalMessageState,
	userRefetchTriggerState,currentChatState,
	messagesRefetchTriggerState} from '../atoms/userAtom'
import Link from 'next/link'; 
import VideoCall from './VideoCall';
import IncomingCallNotify from './IncomingCallNotify';
import {RxCross2} from 'react-icons/rx';
import {TbReport} from 'react-icons/tb';
import {RiMap2Line} from 'react-icons/ri';
import {FaCarBattery} from 'react-icons/fa';
import {RiToolsFill} from 'react-icons/ri';
 
let inCall = false;
let inGroupCall = false;

export default function PilotSidebar({dragRef}) {
	// body...
	const [openSideBarMobile,setOpenSideBarMobile] = useRecoilState(openSideBarMobileState);
 	const [acceptedCall,setAcceptedCall] = useState(false);
	const [currentTab,setCurrentTab] = useRecoilState(currentTabState);
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);
 	const [revealNotify,setRevealNotify] = useState('');
 	const [notify,setNotify] = useState(false);
 	const [openMoreOptions,setOpenMoreOptions] = useState(false)
	const router = useRouter();


	const menuItems = [
	{
		icon:<HiOutlineHome className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/> ,
		menu:'Dashboard'
	},
	{
		icon:<RiMap2Line className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/> ,
		menu:'Map view'
	},
	{
		icon:<LuBox className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out`}/>,
		menu:'Projects'
	},
	{
		main:true,
		icon:<RiToolsFill className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out`}/>,
		menu:'Inventory',
		sub:[
			{
				icon:<TbDrone className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out`}/>,
				menu:'Drones',
			},
			{
				icon:<FaCarBattery className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out`}/>,
				menu:'Batteries',
			}
		]
	},
	{
		icon:<AiOutlineMessage className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/>,
		menu:'message'
	},
	{
		icon:<TbReport className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/>,
		menu:'Logs'
	},
	{
		icon:<RiSettings3Line className={`${sideBarExtend ? 'h-5 w-5' : 'h-full w-full' } transition-all duration-200 ease-in-out `}/>,
		menu:'Settings'
	},
	]

	return (
		<main className={`${sideBarExtend ?  'sm:w-[17%] xs:w-[11%] w-[100%] xs:relative fixed' : 'w-[7%] relative'} 
		z-50 flex flex-col h-full bg-[#2c2c2c] pt-4 transition-all duration-300 ease-in-out ${openSideBarMobile ? 'top-0' :'xs:top-0 top-[100%]'} left-0`}>
			<div onClick={()=>setSideBarExtend(!sideBarExtend)} className={`hidden xs:block absolute p-1 cursor-pointer ${sideBarExtend ? 'h-6 w-6 -right-3 top-14' : '-right-2 top-12 h-5 w-5'} 
			rounded-full bg-[#3d3d3d] hover:bg-gray-700 transition-all duration-200 ease-in-out`}>
				<AiOutlineRight className={`h-full w-full text-white ${sideBarExtend ? 'rotate-180' : 'rotate-0'} transition-all duration-300 ease-in-out `}/>
			</div>
			<div onClick={()=>setOpenSideBarMobile(false)}
			className="w-full flex xs:hidden items-center justify-center px-2 py-1">
				<div 
				className='h-1 w-[100px] bg-gray-300 hover:bg-blue-500 transition-all duration-100 
				ease-in-out rounded-full cursor-pointer'/>
			</div>

			<div className={`w-full ${sideBarExtend ? 'px-6': 'px-2'} transition-all duration-300 ease-in-out`}>
				<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_JxPo9zToO" alt="Logo" className="w-[100px] rounded-xl"/>
			</div>
			<div className="mt-4 overflow-y-auto h-full w-full px-4  
			scrollbar-thumb-sky-500 py-2 flex flex-col gap-2 scrollbar-none">
				{
					menuItems.map((item,j)=>(	
						<>
						{
							!item.main ?
							<Link href={`/pilot/${item?.menu?.replace(' ','').toLowerCase()}`}
							onClick={()=>{setCurrentTab(item.menu)}}
							className={`rounded-xl ${currentTab === item?.menu ? 'bg-[#3d3d3d] shadow-lg shadow-sky-80/10 ' : 'bg-transparent'} 
							p-2 flex items-center gap-3 hover:bg-[#3d3d3d] to-sky-500 from-sky-600 hover:shadow-lg hover:shadow-sky-80/10 cursor-pointer transition-all 
							group ${sideBarExtend ? 'md:justify-start xs:justify-center justify-start' : 'justify-center'} `} key={j} >
								<div className={`p-2 rounded-xl ${currentTab === item.menu ? 'text-gray-100' : 'text-white'} 
								group-hover:text-gray-100 shadow-lg shadow-black/30 group-hover:scale-[105%] transition-scale duration-100 ease-in-out `}>
									{item?.icon}
								</div>
								<h2 className={`lg:text-sm xs:text-xs text-sm break-text ${currentTab === item?.menu ? 'text-gray-200 font-semibold' : 'text-white' }
								group-hover:text-gray-200 ${sideBarExtend ? 'xs:hidden md:block' : 'sm:hidden'} group-hover:font-semibold block `}>{item?.menu}</h2>
							</Link>
							:
							<div className="flex flex-col gap-2">
								<div href={`/pilot/${item?.menu?.replace(' ','').toLowerCase()}`}
								onClick={()=>{setOpenMoreOptions(!openMoreOptions)}}
								className={`rounded-xl ${(item?.sub?.find(tab => tab.menu === currentTab)) ? 'bg-[#3d3d3d] shadow-lg shadow-sky-80/10 ' : 'bg-transparent'} 
								p-2 flex items-center hover:bg-[#3d3d3d] to-sky-500 from-sky-600 hover:shadow-lg hover:shadow-sky-80/10 cursor-pointer transition-all 
								group ${sideBarExtend ? 'md:justify-start xs:justify-center justify-start' : 'justify-center'} `} key={j} >
									<div className={`p-2 rounded-xl ${currentTab === item.menu ? 'text-gray-100' : 'text-white'} 
									group-hover:text-gray-100 shadow-lg shadow-black/30 group-hover:scale-[105%] transition-scale duration-100 ease-in-out `}>
										{item?.icon}
									</div>
									<h2 className={`lg:text-sm ml-3 xs:text-xs text-sm break-text ${currentTab === item?.menu ? 'text-gray-200 font-semibold' : 'text-white' }
									group-hover:text-gray-200 ${sideBarExtend ? 'xs:hidden md:block' : 'sm:hidden'} group-hover:font-semibold block `}>{item?.menu}</h2>
									<BsFillCaretDownFill className={`h-3 ml-2 w-3 ${openMoreOptions ? 'rotate-180' : 'rotate-0'} transition-all duration-200 
									ease-in-out text-white`}/>
								</div>
								{
									openMoreOptions &&
									<div className="pl-2 gap-2 flex flex-col">
										{
											item?.sub?.map((ite,k)=>(
												<Link key={k} href={`/pilot/${ite?.menu?.replace(' ','').toLowerCase()}`}
												onClick={()=>{setCurrentTab(ite?.menu);setOpenMoreOptions(false)}}
												className={`rounded-xl ${currentTab === ite?.menu ? 'bg-[#3d3d3d] shadow-lg shadow-sky-80/10 ' : 'bg-transparent'} 
												p-2 flex items-center gap-3 hover:bg-[#3d3d3d] to-sky-500 from-sky-600 hover:shadow-lg hover:shadow-sky-80/10 cursor-pointer transition-all 
												group ${sideBarExtend ? 'md:justify-start xs:justify-center justify-start' : 'justify-center'} `} >
													<div className={`p-2 rounded-xl ${currentTab === ite.menu ? 'text-gray-100' : 'text-white'} 
													group-hover:text-gray-100 shadow-lg shadow-black/30 group-hover:scale-[105%] transition-scale duration-100 ease-in-out `}>
														{ite?.icon}
													</div>
													<h2 className={`lg:text-sm xs:text-xs text-sm break-text ${currentTab === ite?.menu ? 'text-gray-200 font-semibold' : 'text-white' }
													group-hover:text-gray-200 ${sideBarExtend ? 'xs:hidden md:block' : 'sm:hidden'} group-hover:font-semibold block `}>{ite?.menu}</h2>
												</Link>
											))
										}
									</div>
								}
							</div>
						}
						</>

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