import {create} from "zustand";

type HeartsModalState = {
    isOpen: boolean,
    open: () => void;
    close: () => void;
}

export const useHeartsModal = create<HeartsModalState>((set) => ({
    isOpen: false,
    open: () => set({isOpen: true}),
    close: () => set({isOpen: false}),
}));

// the above code and hook is to manage the state of the exit modal