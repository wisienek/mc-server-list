import {ListServersDto} from '@shared/dto';
import {ServerCategory} from '@shared/enums';

function parseSearchParams(params: {
    [key: string]: string | string[] | undefined;
}): ListServersDto {
    const searchData: ListServersDto = {isOwn: false};

    if (params.currentPage) {
        searchData.page = Number(
            Array.isArray(params.currentPage)
                ? params.currentPage[0]
                : params.currentPage,
        );
    }
    if (params.perPage) {
        searchData.perPage = Number(
            Array.isArray(params.perPage) ? params.perPage[0] : params.perPage,
        );
    }
    if (params.q) {
        searchData.q = Array.isArray(params.q) ? params.q[0] : params.q;
    }
    if (params.isOwn) {
        const value = Array.isArray(params.isOwn) ? params.isOwn[0] : params.isOwn;
        searchData.isOwn = value === 'true';
    }
    if (params.categories) {
        const rawCategories = Array.isArray(params.categories)
            ? params.categories
            : [params.categories];

        const allowedCategories = new Set(Object.values(ServerCategory));

        searchData.categories = rawCategories.filter((cat) =>
            allowedCategories.has(cat as ServerCategory),
        ) as ServerCategory[];
    }

    return searchData;
}

export default parseSearchParams;
