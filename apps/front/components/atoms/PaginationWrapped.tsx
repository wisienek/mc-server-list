import Pagination from '@mui/material/Pagination';

type PaginationWrappedProps = {
    items: Array<unknown>;
    totalItems: number;
    pages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
};

const PaginationWrapped = ({
    pages,
    currentPage,
    setCurrentPage,
}: PaginationWrappedProps) => {
    return (
        <Pagination
            showFirstButton={true}
            showLastButton={true}
            shape="rounded"
            count={pages}
            variant="outlined"
            color="primary"
            defaultPage={1}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
        />
    );
};

export default PaginationWrapped;
