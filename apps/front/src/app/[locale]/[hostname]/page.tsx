import {parseResult} from '@core';
import {getServerDetails} from '@front/components/actions/getServerDetails';
import {Metadata, ResolvingMetadata} from 'next';
import {notFound} from 'next/navigation';
import type {HostnamePageProps} from './layout';

export const revalidate = 3_600;
export const dynamicParams = true;

export async function generateMetadata(
    props: HostnamePageProps,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const hostName = (await props.params).hostname;
    const serverDetailsResponse = parseResult(await getServerDetails(hostName));

    if (serverDetailsResponse.isErr()) {
        return notFound();
    }

    const serverDetails = serverDetailsResponse.unwrap();

    const previousImages = (await parent).openGraph?.images || [];

    const images = [serverDetails.banner, serverDetails.icon].filter(Boolean);

    return {
        title: serverDetails.name ?? serverDetails.host,
        openGraph: {
            images: [...images, ...previousImages],
        },
    };
}

export default async function Page() {
    return <></>;
}
