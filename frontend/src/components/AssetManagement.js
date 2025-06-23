"use client"

import ImportantNotify from './DashboardComponents/ImportantNotify';
import Header from './Header';
import AssetSelector from './AssetManagementComponents/AssetSelector'
import DroneAssets from './AssetManagementComponents/DroneAssets'
import BatteryAssets from './AssetManagementComponents/BatteryAssets'
import {useState} from 'react'
import {useRecoilState} from 'recoil';
import {sideBarExtendState} from '../atoms/userAtom'

export default function UserManager() {
	// body...
	const [currentAssetTab,setCurrentAssetTab] = useState('Drone')
	const [sideBarExtend,setSideBarExtend] = useRecoilState(sideBarExtendState);


	return (
		<main className={`h-full ${sideBarExtend ? 'sm:w-[81%] xs:w-[86%] w-[100%]' : 'w-[100%]'}  bg-gray-50 pb-5 overflow-y-auto`}>
			<Header />
			<ImportantNotify />
			<AssetSelector currentAssetTab={currentAssetTab} setCurrentAssetTab={setCurrentAssetTab} />
			{
				currentAssetTab === 'Battery'?
				<BatteryAssets currentAssetTab={currentAssetTab} setCurrentAssetTab={setCurrentAssetTab} />
				:
				<DroneAssets currentAssetTab={currentAssetTab} setCurrentAssetTab={setCurrentAssetTab} />
			}
		</main>

	)
}