import {create} from 'zustand'

export const useProgressStore = create((set)=>({
	isAnimating:true,
	setIsAnimating: (isAnimating) => set(() => ({ isAnimating }))
}));