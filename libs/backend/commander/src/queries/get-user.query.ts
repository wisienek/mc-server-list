import {User} from '@backend/db';
import {PartialType, PickType} from '@nestjs/swagger';

export class GetUserQuery extends PartialType(
    PickType(User, ['id', 'email', 'discordId', 'discordTag', 'username']),
) {}
