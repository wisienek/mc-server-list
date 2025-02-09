import Typography from '@mui/material/Typography';
import type {ElementType, FC} from 'react';
import {ServerType} from '@shared/enums';
import JavaIcon from '@front/components/atoms/icons/java.svg';
import BedrockIcon from '@front/components/atoms/icons/bedrock.svg';

interface ServerTypeOptionProps {
    type: ServerType;
}

const ServerTypeOption: FC<ServerTypeOptionProps> = ({type}) => {
    let label = '';
    let IconComponent: ElementType;

    switch (type) {
        case ServerType.JAVA:
            label = 'Java';
            IconComponent = JavaIcon;
            break;
        case ServerType.BEDROCK:
            label = 'Bedrock';
            IconComponent = BedrockIcon;
            break;
        default:
            label = '';
            IconComponent = () => null;
    }

    return (
        <>
            <IconComponent style={{width: 24, height: 24, marginRight: 8}} />
            <Typography variant="body1">{label}</Typography>
        </>
    );
};

export default ServerTypeOption;
