import {getServerDetails} from '@front/components/actions/getServerDetails';
import ServerBanner from '@front/components/atoms/ServerBanner';
import type {HostnamePageProps} from '../layout';

export default async function Page(props: HostnamePageProps) {
    const hostName = (await props.params).hostname;
    const serverDetails = await getServerDetails(hostName);

    return (
        <>
            <ServerBanner server={serverDetails} />
        </>
    );
}
