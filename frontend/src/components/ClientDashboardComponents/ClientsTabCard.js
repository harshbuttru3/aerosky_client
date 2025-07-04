"use client "
import {BsThreeDotsVertical} from 'react-icons/bs'
import {GrMail} from 'react-icons/gr';
import {IoMdCall} from 'react-icons/io';
import {AiOutlineDelete,AiOutlineEdit} from 'react-icons/ai';
import {useState} from 'react';
import {LiaIndustrySolid} from 'react-icons/lia';
import {useRouter} from 'next/navigation';
import {useRecoilState} from 'recoil';
import {currentUserState} from '../../atoms/userAtom'


export default function ClientsTabCard({client,j,setRemoveClientReveal,setRemoveClient}) {
	// body...
	const router = useRouter();
	const [deleteEditReveal,setDeleteEditReveal] = useState(false);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);

	// console.log(currentUser)

	return (
		<div key={j} className="bg-white flex flex-col rounded-md shadow-md px-3 py-4 shadow-gray-300/50">
			<div className="flex justify-between">
				<div className="rounded-full w-[70px] h-[70px] relative">
					<div className="absolute bottom-2 right-0 h-3 w-3 bg-blue-600 rounded-full"/> 
					<div className="absolute bottom-2 right-0 h-3 w-3 animate-ping bg-blue-600 rounded-full"> 
					</div>
					<img src={client?.image} alt="" className="h-full rounded-full w-full"/>
				</div>
				<div className="relative">
					{/*<div className={`right-0 top-7 flex flex-col bg-gray-50 border-[1px] 
					border-gray-400/50 rounded-md ${deleteEditReveal ? 'absolute' : 'hidden' } shadow-md `}>
						<div 
						onClick={()=>{
							setRemoveClientReveal(true);
							setRemoveClient(client)
						}}
						className="flex cursor-pointer group text-gray-600 px-2 py-[2px] hover:text-red-500 
						transition-all duration-100 ease-out text-sm items-center hover:bg-gray-200/50 gap-2">
							<AiOutlineDelete className="h-3 w-3 group-hover:text-red-500 text-gray-400"/>Remove
						</div>
						<div className="flex  cursor-pointer px-2 items-center gap-2 py-[2px] group hover:text-sky-500 
						transition-all duration-100 ease-out text-sm text-gray-600 hover:bg-gray-200/50">
							<AiOutlineEdit className="h-3 w-3 group-hover:text-sky-500 text-gray-400"/>Edit
						</div>
					</div>*/}
					<div 
					onClick={()=>setDeleteEditReveal(!deleteEditReveal)}					
					className="p-1 rounded-full cursor-pointer hover:bg-gray-200/30 transition-all duration-200 ease-in-out">
						<BsThreeDotsVertical className="h-4 w-4 text-gray-700"/>
					</div>	
				</div>
			</div>
			<div className="mt-3 w-full flex flex-col">
				<p className="text-xs text-gray-500">{client?.organizationRole?.length > 1 ? client?.organizationRole?.map((role,j)=>(
					<>{role !== 'client' && role.toUpperCase()} - </>
				))
				:
				client?.organizationRole?.map((role,j)=>(
					<>{role !== 'client' && role.toUpperCase()}</>
				))
				}</p>
				<h1 className="text-lg font-semibold hover:text-blue-600 
				transition-all duration-200 ease-out cursor-pointer">{client?.name}</h1>
				<p className="text-xs text-gray-500"><span className="font-semibold">Project field</span>: {client?.clientIndustry?.length > 1 ? 
				client?.clientIndustry.map((industry,j)=>(
					<span key={j} >{industry}, </span>
				))
				:
				client?.clientIndustry.map((industry,j)=>(
					<span key={j} >{industry}</span>
				))
				}</p>
				
				<div className="mt-3 flex flex-col gap-[6px]">
					<h1 className="text-gray-800 flex items-center gap-2 text-xs">
						<IoMdCall className="h-3 w-3 text-purple-400"/>{client?.number}
					</h1>
					<h1 className="text-gray-800 flex items-center gap-2 text-xs">
						<GrMail className="h-3 w-3 text-purple-400"/>{client?.email}
					</h1>
					<h1 className="text-gray-800 flex items-center gap-2 text-xs">
						<LiaIndustrySolid className="h-3 w-3 text-purple-400"/>{client?.organizationName} ({client?.organizationType})
					</h1>
				</div>

				<div className="flex items-center gap-3 mt-3">
					<button className={`w-full px-3 py-1 rounded-md 
					text-white text-xs ${currentUser?._id === client?._id ? 'bg-blue-600/40 cursor-not-allowed' : 'bg-blue-600'} `}>
						Message
					</button>

				</div>

			</div>	
		</div>

	)
}