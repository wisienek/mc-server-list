import {parseResult} from '@core';
import {getServerDetails} from '@front/components/actions/getServerDetails';
import ServerMainInfo from '@front/components/molecules/ServerMainInfo';
import {notFound} from 'next/navigation';
import type {HostnamePageProps} from '../layout';

export default async function Page(props: HostnamePageProps) {
    const hostName = (await props.params).hostname;
    const serverDetailsResponse = parseResult(await getServerDetails(hostName));

    if (serverDetailsResponse.isErr()) {
        return notFound();
    }

    return <ServerMainInfo server={serverDetailsResponse.unwrap()} />;
}
