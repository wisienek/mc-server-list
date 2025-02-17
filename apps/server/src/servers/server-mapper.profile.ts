import {AutomapperProfile, InjectMapper} from '@automapper/nestjs';
import {Injectable} from '@nestjs/common';
import {
    createMap,
    forMember,
    mapFrom,
    type Mapper,
    type MappingProfile,
} from '@automapper/core';
import {BedrockServer, JavaServer, Server} from '@backend/db';
import {
    MinecraftServerOnlineStatus,
    ServerDetailsDto,
    ServerDto,
    ServerSummaryDto,
} from '@shared/dto';
import type {McServerSrvRecord} from '@lib/types';
import {ServerType} from '@shared/enums';

@Injectable()
export class ServerMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper) => {
            createMap(
                mapper,
                MinecraftServerOnlineStatus,
                Server,
                forMember(
                    (dest) => dest.host,
                    mapFrom((src) => src.hostname),
                ),
                forMember(
                    (dest) => dest.port,
                    mapFrom((src) => src.port),
                ),
                forMember(
                    (dest) => dest.online,
                    mapFrom((src) => src.online),
                ),
                forMember(
                    (dest) => dest.eula_blocked,
                    mapFrom((src) => src.eula_blocked ?? false),
                ),
                forMember(
                    (dest) => dest.ip_address,
                    mapFrom((src) => src.ip),
                ),
                forMember(
                    (dest) => dest.srv_record,
                    mapFrom(
                        (src) => <McServerSrvRecord>(<unknown>{
                                query: src.debug?.query,
                                srv: src.debug?.srv,
                                cnameinsrv: src.debug?.cnameinsrv,
                            }),
                    ),
                ),
            );

            createMap(
                mapper,
                MinecraftServerOnlineStatus,
                JavaServer,
                forMember(
                    (dest) => dest.type,
                    mapFrom(() => ServerType.JAVA),
                ),
                forMember(
                    (dest) => dest.host,
                    mapFrom((src) => src.hostname),
                ),
                forMember(
                    (dest) => dest.port,
                    mapFrom((src) => src.port),
                ),
                forMember(
                    (dest) => dest.online,
                    mapFrom((src) => src.online),
                ),
                forMember(
                    (dest) => dest.eula_blocked,
                    mapFrom((src) => src.eula_blocked ?? false),
                ),
                forMember(
                    (dest) => dest.versions,
                    mapFrom((src) =>
                        src.version.split(/,|\s/).filter((i) => i && i.length > 0),
                    ),
                ),
                forMember(
                    (dest) => dest.players,
                    mapFrom((src) => ({
                        online: src.players.online,
                        max: src.players.max,
                        list: src.players?.list ?? [],
                    })),
                ),
                forMember(
                    (dest) => dest.motd,
                    mapFrom((src) => src.motd),
                ),
                forMember(
                    (dest) => dest.icon,
                    mapFrom((src) => src.icon),
                ),
                forMember(
                    (dest) => dest.mods,
                    mapFrom((src) => src.mods ?? []),
                ),
                forMember(
                    (dest) => dest.software,
                    mapFrom((src) => src.software),
                ),
                forMember(
                    (dest) => dest.plugins,
                    mapFrom((src) => src.plugins ?? []),
                ),
                forMember(
                    (dest) => dest.srv_record,
                    mapFrom(
                        (src) => <McServerSrvRecord>(<unknown>{
                                query: src.debug?.query,
                                srv: src.debug?.srv,
                                cnameinsrv: src.debug?.cnameinsrv,
                            }),
                    ),
                ),
            );

            createMap(
                mapper,
                MinecraftServerOnlineStatus,
                BedrockServer,
                forMember(
                    (dest) => dest.type,
                    mapFrom(() => ServerType.BEDROCK),
                ),
                forMember(
                    (dest) => dest.host,
                    mapFrom((src) => src.hostname),
                ),
                forMember(
                    (dest) => dest.port,
                    mapFrom((src) => src.port),
                ),
                forMember(
                    (dest) => dest.online,
                    mapFrom((src) => src.online),
                ),
                forMember(
                    (dest) => dest.eula_blocked,
                    mapFrom((src) => src.eula_blocked ?? false),
                ),
                forMember(
                    (dest) => dest.versions,
                    mapFrom((src) =>
                        src.version.split(/,|\s/).filter((i) => i && i.length > 0),
                    ),
                ),
                forMember(
                    (dest) => dest.players,
                    mapFrom((src) => ({
                        online: src.players.online,
                        max: src.players.max,
                        list: src.players?.list ?? [],
                    })),
                ),
                forMember(
                    (dest) => dest.motd,
                    mapFrom((src) => src.motd),
                ),
                forMember(
                    (dest) => dest.gamemode,
                    mapFrom((src) => src.gamemode),
                ),
                forMember(
                    (dest) => dest.server_id,
                    mapFrom((src) => src.serverid),
                ),
                forMember(
                    (dest) => dest.srv_record,
                    mapFrom(
                        (src) => <McServerSrvRecord>(<unknown>{
                                query: src.debug?.query,
                                srv: src.debug?.srv,
                                cnameinsrv: src.debug?.cnameinsrv,
                            }),
                    ),
                ),
            );

            // TODO: add; online, max, ranking
            createMap(
                mapper,
                Server,
                ServerDto,
                forMember(
                    (dest) => dest.id,
                    mapFrom((src) => src.id),
                ),
                forMember(
                    (dest) => dest.online,
                    mapFrom((src) => src.online),
                ),
                forMember(
                    (dest) => dest.host,
                    mapFrom((src) => src.host),
                ),
                forMember(
                    (dest) => dest.port,
                    mapFrom((src) => src.port),
                ),
                forMember(
                    (dest) => dest.ip_address,
                    mapFrom((src) => src.ip_address),
                ),
                forMember(
                    (dest) => dest.eula_blocked,
                    mapFrom((src) => src.eula_blocked),
                ),
                forMember(
                    (dest) => dest.srv_record,
                    mapFrom((src) => src.srv_record),
                ),
                forMember(
                    (dest) => dest.owner,
                    mapFrom((src) => src.owner),
                ),
                forMember(
                    (dest) => dest.categories,
                    mapFrom((src) => src.categories),
                ),
                forMember(
                    (dest) => dest.owner_id,
                    mapFrom((src) => src.owner_id),
                ),
                forMember(
                    (dest) => dest.isActive,
                    mapFrom((src) => src.isActive),
                ),
                forMember(
                    (dest) => dest.icon,
                    mapFrom((src) => src.icon),
                ),
                forMember(
                    (dest) => dest.banner,
                    mapFrom((src) => src.banner),
                ),
                forMember(
                    (dest) => dest.name,
                    mapFrom((src) => src.name),
                ),
                forMember(
                    (dest) => dest.description,
                    mapFrom((src) => src.description),
                ),
                forMember(
                    (dest) => dest.versions,
                    mapFrom((src) => src.versions),
                ),
            );

            // TODO: add votes
            createMap(
                mapper,
                Server,
                ServerSummaryDto,
                forMember(
                    (dest) => dest.name,
                    mapFrom((src) => src.name ?? src.host),
                ),
                forMember(
                    (dest) => dest.description,
                    mapFrom((src) => src.description ?? src.motd.clean),
                ),
                forMember(
                    (dest) => dest.onlinePlayers,
                    mapFrom((src) => src['players']['online'] ?? 0),
                ),
                forMember(
                    (dest) => dest.maxPlayers,
                    mapFrom((src) => src['players']['max'] ?? 0),
                ),
                forMember(
                    (dest) => dest.versions,
                    mapFrom((src) => src.versions),
                ),
                forMember(
                    (dest) => dest.verificationCode,
                    mapFrom((src) => src?.verification?.code),
                ),
            );

            createMap(mapper, ServerDto, ServerSummaryDto);
            createMap(mapper, Server, ServerDetailsDto);
        };
    }
}
