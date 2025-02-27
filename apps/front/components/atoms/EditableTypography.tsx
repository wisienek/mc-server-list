'use client';
import Typography, {type TypographyProps} from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import {styled} from '@mui/material/styles';
import {type FC, useState, useEffect, type ChangeEvent, useRef} from 'react';
import {useDebounce} from 'react-use';

const StyledInput = styled(InputBase)(() => ({
    border: 'none',
    outline: 'none',
    background: 'transparent',
    padding: 0,
    width: '100%',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
}));

export type EditableTypographyProps = TypographyProps & {
    title: string;
    placeholder?: string;
    debounceTime?: number;
    handleInputChange?: (value: string) => void;
};

const EditableTypography: FC<EditableTypographyProps> = ({
    title = '',
    placeholder = '',
    debounceTime = 800,
    handleInputChange,
    ...typographyProps
}) => {
    const [value, setValue] = useState<string>(title);
    const isFirstRun = useRef<boolean>(true);

    useEffect(() => {
        setValue(title);
    }, [title]);

    useDebounce(
        () => {
            if (isFirstRun.current) {
                isFirstRun.current = false;
                return;
            }

            handleInputChange(value);
        },
        debounceTime,
        [value],
    );

    return (
        <Typography {...typographyProps}>
            <StyledInput
                multiline
                value={value ?? ''}
                placeholder={placeholder}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setValue(e.target.value)
                }
            />
        </Typography>
    );
};

export default EditableTypography;
