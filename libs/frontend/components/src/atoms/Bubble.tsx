'use client';
import {
    useMemo,
    type FC,
    type ReactNode,
    type FunctionComponent,
    type SVGProps,
    useEffect,
    useCallback,
} from 'react';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {styled, useTheme} from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import BackgroundBubbleIcon1 from '@lib/front/components/atoms/icons/background-buble-1.svg';
import BackgroundBubbleIcon2 from '@lib/front/components/atoms/icons/background-buble-2.svg';
import BackgroundBubbleIcon3 from '@lib/front/components/atoms/icons/background-buble-3.svg';
import BackgroundBubbleIcon4 from '@lib/front/components/atoms/icons/background-buble-4.svg';
import {removeNotification} from '@lib/front/components/store/notificationsSlice';
import BubbleIcon from '@lib/front/components/atoms/icons/bubble-icon.svg';
import {useAppDispatch} from '@lib/front/components/store/store';
import Badge from '@mui/material/Badge';

type BubbleLevel = 'Info' | 'Warning' | 'Success' | 'Error';

interface BubbleProps {
    id: string;
    level: BubbleLevel;
    title: ReactNode | string;
    description: ReactNode | string;
    onClose?: () => void;
    count: number;
}

const CenteredBubbleIconContainer = styled('div')(({theme}) => ({
    position: 'relative',
    width: '100px',
    height: '100px',
    top: theme.spacing(-2.5),
    left: theme.spacing(3),
}));

const BottomBubbleContainer = styled('div')(({theme}) => ({
    position: 'absolute',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
}));

const createStyledBottomBubbles = (
    Icon: FunctionComponent<SVGProps<SVGSVGElement>>,
) =>
    styled(Icon)(({theme}) => ({
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: theme.spacing(8),
        width: '100%',
    }));

const BubbleIconContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
}));

const BubbleTextContainer = styled('div')(() => ({
    overflow: 'auto',
}));

const BubbleCloseContainer = styled('div')(({theme}) => ({
    padding: theme.spacing(0.5),
    paddingTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
}));

const BubbleContainer = styled(Grid)<{level: BubbleLevel}>(({theme, level}) => ({
    position: 'relative',
    display: 'inline-grid',
    gridTemplateColumns: '1.5fr 6fr 0.5fr',
    borderRadius: theme.shape.borderRadius,
    maxHeight: theme.spacing(16),
    maxWidth: theme.spacing(64),
    boxShadow: theme.shadows[16],
    backgroundColor:
        theme.palette[level.toLowerCase() as Lowercase<BubbleLevel>].main,
}));

const BubbleNotification: FC<BubbleProps> = ({
    level,
    title,
    description,
    onClose,
    count,
    id,
}) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();

    const autoDismissTime = 10_000 as const;

    const Icon = useMemo(() => {
        switch (level) {
            case 'Info':
                return QuestionMarkIcon;
            case 'Warning':
                return PriorityHighIcon;
            case 'Error':
                return CloseIcon;
            case 'Success':
                return CheckIcon;
            default:
                return QuestionMarkIcon;
        }
    }, [level]);

    const BottomIcon = useMemo(() => {
        switch (level) {
            case 'Info':
                return createStyledBottomBubbles(BackgroundBubbleIcon1);
            case 'Warning':
                return createStyledBottomBubbles(BackgroundBubbleIcon2);
            case 'Error':
                return createStyledBottomBubbles(BackgroundBubbleIcon3);
            case 'Success':
                return createStyledBottomBubbles(BackgroundBubbleIcon4);
            default:
                return createStyledBottomBubbles(BackgroundBubbleIcon1);
        }
    }, [level]);

    const backgroundIconColorFill = useMemo(
        () => theme.palette[level.toLowerCase() as Lowercase<BubbleLevel>].dark,
        [level, theme],
    );

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
            return;
        }
        dispatch(removeNotification(id));
    }, [dispatch, id, onClose]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, autoDismissTime);

        return () => clearTimeout(timer);
    }, [count, handleClose]);

    return (
        <Badge
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            badgeContent={count !== 1 ? count : null}
            color="secondary"
        >
            <BubbleContainer level={level}>
                <BubbleIconContainer>
                    <CenteredBubbleIconContainer>
                        <BubbleIcon
                            fill={backgroundIconColorFill}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '50%',
                                height: '50%',
                                zIndex: 1,
                            }}
                        />
                        <Icon
                            style={{
                                position: 'absolute',
                                top: 'calc(25% - 5px)',
                                left: '25%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 2,
                                color: 'white',
                            }}
                        />
                    </CenteredBubbleIconContainer>
                    <BottomBubbleContainer>
                        <BottomIcon fill={backgroundIconColorFill} />
                    </BottomBubbleContainer>
                </BubbleIconContainer>

                <BubbleTextContainer>
                    <Typography variant="h4" color="white">
                        {title}
                    </Typography>
                    <Typography variant="body1" color="white">
                        {description}
                    </Typography>
                </BubbleTextContainer>

                <BubbleCloseContainer onClick={handleClose}>
                    <CloseIcon sx={{color: 'white', cursor: 'pointer'}} />
                </BubbleCloseContainer>
            </BubbleContainer>
        </Badge>
    );
};

export type {BubbleLevel, BubbleProps};
export default BubbleNotification;
