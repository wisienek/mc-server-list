import ServerDescriptionSection from '@front/components/molecules/ServerDescriptionSection';
import {markdownComponents} from '@front/components/atoms/CustomMdxRemote';
import {getServerDetails} from '@front/components/actions/getServerDetails';
import {evaluate} from 'next-mdx-remote-client/rsc';
import type {HostnamePageProps} from '../layout';

export default async function Page(props: HostnamePageProps) {
    const hostName = (await props.params).hostname;
    const serverDetails = await getServerDetails(hostName);

    const evaluatedMDX = await evaluate({
        source: serverDetails?.description ?? '',
        components: markdownComponents,
    });

    return (
        <ServerDescriptionSection
            server={{...serverDetails, mdxSource: evaluatedMDX}}
        />
    );
}
