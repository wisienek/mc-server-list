import {User} from '@backend/db';
import {Injectable} from '@nestjs/common';
import {
    createMap,
    forMember,
    mapFrom,
    type Mapper,
    type MappingProfile,
} from '@automapper/core';
import {AutomapperProfile, InjectMapper} from '@automapper/nestjs';
import {UserDto} from '@shared/dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper: Mapper) => {
            createMap(
                mapper,
                User,
                UserDto,
                forMember(
                    (dest) => dest.avatar,
                    mapFrom((src) => src.avatar ?? undefined),
                ),
            );

            createMap(mapper, UserDto, User);
        };
    }
}
