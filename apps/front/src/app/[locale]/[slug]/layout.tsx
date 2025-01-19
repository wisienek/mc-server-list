import type {ReactNode} from 'react';
import type {LocaleParams} from '../layout';
import {notFound} from 'next/navigation';
import type {McServerBedrockInfo, MCServerJavaInfo} from '@lib/types';

type SlugServerLayoutParams = {
    slug: string;
} & LocaleParams;

type SlugServerLayoutProps = {
    children: ReactNode;
    params: Promise<SlugServerLayoutParams>;
};

const getMCServerInfoBySlug = (
    slug: string,
): MCServerJavaInfo | McServerBedrockInfo => {
    return {
        retrieved_at: 1681883645007,
        expires_at: 1681883705007,
        online: true,
        host: 'hub.penguin.gg',
        port: 25565,
        ip_address: '202.165.124.242',
        eula_blocked: false,
        srv_record: {
            host: 'hub-java.penguin.gg',
            port: 25565,
        },
        version: {
            name_raw: 'Velocity 1.7.2-1.21.4',
            name_clean: 'Velocity 1.7.2-1.21.4',
            name_html: '<span><span>Velocity 1.7.2-1.21.4</span></span>',
            protocol: 47,
        },
        players: {
            online: 973,
            max: 1000,
            list: [],
        },
        motd: {
            raw: ' §b§lPENGUIN.GG §f§l» §6§lSKYBLOCK SEASON 10 OUT NOW!\n                §f§l❅ §aSurvival §f§l| §bSkyblock §f§l❅',
            clean: ' PENGUIN.GG » SKYBLOCK SEASON 10 OUT NOW!\n                ❅ Survival | Skyblock ❅',
            html: '<span><span> </span><span style="color: #55ffff;font-weight: bold;">PENGUIN.GG </span><span style="color: #ffffff;font-weight: bold;">» </span><span style="color: #ffaa00;font-weight: bold;">SKYBLOCK SEASON 10 OUT NOW!</span><span>\n                </span><span style="color: #ffffff;font-weight: bold;">❅ </span><span style="color: #55ff55;">Survival </span><span style="color: #ffffff;font-weight: bold;">| </span><span style="color: #55ffff;">Skyblock </span><span style="font-weight: bold;color: #ffffff;">❅</span></span>',
        },
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4 (...5.0 kB)',
        mods: [],
        software: null,
        plugins: [],
    } satisfies MCServerJavaInfo;
};

async function SlugServerLayout(props: SlugServerLayoutProps) {
    const params = await props.params;
    const serverInfo = getMCServerInfoBySlug(params.slug);

    if (!serverInfo) {
        return notFound();
    }

    return <>{props.children}</>;
}

export default SlugServerLayout;
