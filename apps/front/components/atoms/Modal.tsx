import Box from '@mui/material/Box';
import MuiModal, {ModalProps as MuiModalProps} from '@mui/material/Modal';
import {styled} from '@mui/material/styles';
import type {ReactNode} from 'react';

const ModalContent = styled(Box)(({theme}) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
}));

type ModalProps = MuiModalProps & {children: ReactNode};

const Modal = ({children, ...modalProps}: ModalProps) => {
    return (
        <MuiModal {...modalProps}>
            <ModalContent>{children}</ModalContent>
        </MuiModal>
    );
};

export default Modal;
