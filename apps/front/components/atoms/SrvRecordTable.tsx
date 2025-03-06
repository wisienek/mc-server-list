import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import {useTranslations} from 'next-intl';
import {type FC} from 'react';
import TableHead from '@mui/material/TableHead';

type SrvRecordTableProps = {
    srvRecord: Record<string, unknown>;
};

const SrvRecordTable: FC<SrvRecordTableProps> = ({srvRecord}) => {
    const t = useTranslations('page.hostPage.srv');

    const formatValue = (value: unknown) => {
        if (value === undefined) {
            return 'N/A';
        }

        if (typeof value === 'string') {
            return value;
        }

        return JSON.stringify(value);
    };

    return (
        <Table size="small" aria-label="Summary for srv records">
            <TableHead>
                <TableRow>
                    <TableCell size="medium">{t('header')}</TableCell>
                    <TableCell size="medium">{t('value')}</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {Object.entries(srvRecord).map(([key, value]) => (
                    <TableRow key={`srv-${key}`}>
                        <TableCell scope="row">
                            <Typography variant="subtitle2">{key}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" color="textSecondary">
                                {formatValue(value)}
                            </Typography>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default SrvRecordTable;
