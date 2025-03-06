import ServerSRVRecordSection from '@front/components/molecules/ServerSRVRecordSection';
import {getServerDetails} from '@front/components/actions/getServerDetails';
import type {HostnamePageProps} from '../layout';

export default async function Page(props: HostnamePageProps) {
    const hostName = (await props.params).hostname;
    const serverDetails = await getServerDetails(hostName);

    return (
        <>
            <ServerSRVRecordSection server={serverDetails} />
        </>
    );
}
