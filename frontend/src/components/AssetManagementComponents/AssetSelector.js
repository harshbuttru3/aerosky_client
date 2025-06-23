import {TbDrone} from 'react-icons/tb';
import {BiSolidCarBattery} from 'react-icons/bi';

export default function AssetSelector({currentAssetTab,setCurrentAssetTab}) {
	// body...


	return (
		<div className="w-full md:px-8 px-2 py-3 flex items-center justify-end gap-3">
			<div onClick={()=>setCurrentAssetTab('Drone')}
			className={`p-1 transition-all ${currentAssetTab === 'Drone' ? 'bg-blue-600 text-white hover:bg-blue-800' : 'hover:bg-sky-200/30 text-gray-600'} 
			duration-200 ease-in-out cursor-pointer rounded-md border-[1px] border-gray-400`}>
				<TbDrone className={`h-5 w-5`}/>
			</div>
			<div onClick={()=>setCurrentAssetTab('Battery')}
			className={`p-1 transition-all  ${currentAssetTab === 'Battery' ? 'bg-blue-600 hover:bg-blue-800 text-white' : 'hover:bg-sky-200/30 text-gray-600'} 
			duration-200 ease-in-out cursor-pointer rounded-md border-[1px] border-gray-400`}>
				<BiSolidCarBattery className={`h-5 w-5`}/>
			</div>
		</div>

	)
}