export interface McServerPlayerInfo {
    uuid: string;
    name_raw: string;
    name_clean: string;
    name_html: string;
}

export interface McServerInfoPlayers {
    online: number;
    max: number;
    list: McServerPlayerInfo[];
}

export interface McServerVersionInfo {
    protocol: number;
}

export interface McServerJavaVersionInfo extends McServerVersionInfo {
    name_raw: string;
    name_clean: string;
    name_html: string;
}

export interface McServerBedrockVersionInfo extends McServerVersionInfo {
    protocol: number;
}

export interface McServerMotd {
    raw: string;
    clean: string;
    html: string;
}

export interface McServerMod {
    name: string;
    version: string;
}
export interface McServerPlugin {
    name: string;
    version: string | null;
}

export interface McServerSrvRecord {
    host: string;
    port: number;
}

export interface McServerInfo {
    online: boolean;
    host: string;
    port: number;
    ip_address: string | null;
    eula_blocked: boolean;
    retrieved_at: number;
    expires_at: number;
}

export interface MCServerJavaInfo extends McServerInfo {
    version: McServerJavaVersionInfo | null;
    players: McServerInfoPlayers;
    motd: McServerMotd;
    icon: string | null;
    mods: McServerMod[];
    software: string | null;
    plugins: McServerPlugin[];
    srv_record: McServerSrvRecord;
}

export interface McServerBedrockInfo extends McServerInfo {
    version: McServerBedrockVersionInfo | null;
    players: Omit<McServerInfoPlayers, 'list'>;
    gamemode: string;
    server_id: string;
    edition: 'MCPE' | 'MCEE';
}
