import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

export type ModalType = 'login' | null;

interface ModalState {
    activeModal: ModalType;
    isOpen: boolean;
}

const initialState: ModalState = {
    activeModal: null,
    isOpen: false,
};

const modalSlice = createSlice({
    name: 'internalModal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<ModalType>) => {
            state.activeModal = action.payload;
            state.isOpen = true;
        },
        closeModal: (state) => {
            state.activeModal = null;
            state.isOpen = false;
        },
    },
});

export const {openModal, closeModal} = modalSlice.actions;

export default modalSlice.reducer;
