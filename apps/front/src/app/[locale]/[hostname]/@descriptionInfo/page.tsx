import {parseResult} from '@core';
import ServerDescriptionSection from '@front/components/molecules/ServerDescriptionSection';
import {markdownComponents} from '@front/components/atoms/CustomMdxRemote';
import {getServerDetails} from '@front/components/actions/getServerDetails';
import {evaluate} from 'next-mdx-remote-client/rsc';
import {notFound} from 'next/navigation';
import type {HostnamePageProps} from '../layout';

export default async function Page(props: HostnamePageProps) {
    const hostName = (await props.params).hostname;
    const serverDetailsResponse = parseResult(await getServerDetails(hostName));

    if (serverDetailsResponse.isErr()) {
        return notFound();
    }

    const serverDetails = serverDetailsResponse.unwrap();

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
