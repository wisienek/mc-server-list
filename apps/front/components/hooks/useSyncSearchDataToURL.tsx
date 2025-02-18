import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';
import qs from 'qs';
import {ListServersDto} from '@shared/dto';

const useSyncSearchDataToUrl = (searchData: ListServersDto) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const newQueryString = qs.stringify(searchData, {arrayFormat: 'repeat'});
        const currentQueryString = searchParams.toString();

        if (newQueryString !== currentQueryString) {
            router.replace(`${pathname}?${newQueryString}`);
        }
    }, [searchData, pathname, router, searchParams]);
};

export default useSyncSearchDataToUrl;
