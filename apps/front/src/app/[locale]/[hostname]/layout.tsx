import type {ReactNode} from 'react';
import StyledPageContainer from '@front/components/atoms/StyledPageContainer';
import {getHostnames} from '@front/components/actions/getHostnames';
import type {LocaleParams} from '../layout';

type HostNameLayoutProps = {
    children?: ReactNode;
    mainInfo: ReactNode;
    bannerInfo: ReactNode;
    descriptionInfo: ReactNode;
    srcInfo: ReactNode;
};

export type HostnamePageProps = {
    params: Promise<LocaleParams & {hostname: string}>;
};

export const revalidate = 3_600;
export const dynamicParams = true;

export async function generateStaticParams() {
    const hosts = await getHostnames();
    return (hosts ?? []).map((host) => ({
        hostname: host,
    }));
}

async function HostNameLayout(props: HostNameLayoutProps) {
    return (
        <StyledPageContainer>
            {props?.children}
            {props?.mainInfo}
            {props?.bannerInfo}
            {props?.descriptionInfo}
            {props?.srcInfo}
        </StyledPageContainer>
    );
}

export default HostNameLayout;
