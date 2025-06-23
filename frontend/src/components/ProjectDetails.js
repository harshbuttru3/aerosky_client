"use client"
import {useState,useEffect} from 'react';
import {useRouter,useSearchParams } from 'next/navigation' 
import axios from 'axios';
import {getProjectById,getClientById} from '../utils/ApiRoutes';
import Header from './Header';
import {sideBarExtendState,currentMainTabState,currentUserState,currentProjectState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import ImportantNotify from './DashboardComponents/ImportantNotify'
import {BiCategoryAlt} from 'react-icons/bi';
import { IoAnalyticsOutline } from "react-icons/io5";
import {HiOutlineLocationMarker,HiOutlineMail} from 'react-icons/hi';
import {AiOutlineTeam} from 'react-icons/ai';
import ProjectInfoMain from './ProjectComponents/ProjectInfoMain';
import TeamInfoMain from './ProjectComponents/TeamInfoMain';
import AnalyseComponent from './processingTeamComponents/AnalyseComponent';

export default function ProjectDetails({params}) {
	const [currentProject,setCurrentProject] = useRecoilState(currentProjectState);
	const [loading,setLoading] = useState(true);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);
	const [currentMainTab,setCurrentMainTab] = useRecoilState(currentMainTabState);
	const searchParams = useSearchParams()
	const router = useRouter();


	const fetchCurrentProject = async() => {
		const {data} = await axios.post(`${getProjectById}?industry=${searchParams?.get("industry")}`,{
			id:params?.projectId
		})
		if(data?.status){
			console.log(data)
			setCurrentProject(data?.project[0]);
			setLoading(false)
		}else{
			router.push('/processingTeam/Manage')
		}
		console.log(data)
	}


	// useEffect(()=>{
	//     fetchTempUser()
	//   },[])

	  const fetchTempUser = async() => {
	    const {data} = await axios.post(getClientById,{
	      clientId:'65341160546f3e72bce9dfcc'
	    })
	    if(data.status){
	      setCurrentUser(data?.user);
	    }
	  }
	  

	useEffect(()=>{
		if(!currentProject){
			fetchCurrentProject()
		}
		return ()=>{
			setCurrentProject('');
		}
	},[])

	if(loading){
		return (
			<main className="w-full flex items-center flex-col gap-5 justify-center">
				<span className="loader"/>
				<h1 className="text-xl font-semibold text-blue-600 animate-pulse">Loading...</h1>
			</main>
		)
	}

	return (
		<main className={`h-full ${currentMainTab === 'map' ? 'w-[100%]' : sideBarExtend ? 'sm:w-[81%] xs:w-[86%] w-[100%]' : 'w-[100%]'} transition-all duration-300 ease-in-out 
		${currentMainTab === 'map' ? ' bg-[#1f1f1f]' : 'bg-gray-50 pb-5'} overflow-y-auto`}>
			{
				currentMainTab === 'map' ?
				''
				:
				<>
					<Header />
					<div className="w-[97%] mt-3 mx-auto bg-gray-300/70 h-[1px]"/>
				</>
			}
			<div className={`w-full z-45  ${currentMainTab === 'map' ? 'relative hidden' : 'relative'} flex items-center justify-end mt-3 px-5`}>
				<div className="flex bg-white items-center border-[1px] border-gray-400 rounded-md overflow-hidden">
					<div onClick={()=>{
						setCurrentMainTab('projectInfo')
					}} className={`border-r-[1px] ${currentMainTab === 'projectInfo' ? 'bg-blue-500 text-white border-blue-400' : 'hover:bg-gray-200 text-gray-700 border-gray-400'} p-1 cursor-pointer 
					transition-all duration-200 ease-in-out`}>
						<BiCategoryAlt className="h-4 w-4"/>
					</div>
					<div onClick={()=>{
						setCurrentMainTab('map')
					}} className={`border-r-[1px] ${currentMainTab === 'map' ? 'bg-blue-500 text-white border-blue-400' : 'hover:bg-gray-200 text-gray-700 border-gray-400'} p-1 cursor-pointer 
					transition-all duration-200 ease-in-out`}>
						<IoAnalyticsOutline className="h-4 w-4"/>
					</div>
					<div onClick={()=>{
						setCurrentMainTab('clientsInfo')
					}} className={`border-r-[1px] ${currentMainTab === 'clientsInfo' ? 'bg-blue-500 text-white border-blue-400' : 'hover:bg-gray-200 text-gray-700 border-gray-400'} p-1 cursor-pointer 
					transition-all duration-200 ease-in-out`}>
						<AiOutlineTeam className="h-4 w-4"/>
					</div>
				</div>
			</div>
			{
				currentMainTab === 'projectInfo' ? 
				<ProjectInfoMain project={currentProject} setProject={setCurrentProject} />
				:
				currentMainTab === 'clientsInfo' ? 
				<TeamInfoMain project={currentProject} />
				:
				currentMainTab === 'map' ?
				<AnalyseComponent setCurrentMainTab={setCurrentMainTab} currentProject={currentProject} />
				:
				''
			}


		</main>

	)
}