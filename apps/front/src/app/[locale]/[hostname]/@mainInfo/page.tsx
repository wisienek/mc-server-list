import {getServerDetails} from '@front/components/actions/getServerDetails';
import ServerMainInfo from '@front/components/molecules/ServerMainInfo';
import type {HostnamePageProps} from '../layout';

export default async function Page(props: HostnamePageProps) {
    const hostName = (await props.params).hostname;
    const serverDetails = await getServerDetails(hostName);

    return (
        <>
            <ServerMainInfo server={serverDetails} />
        </>
    );
}
