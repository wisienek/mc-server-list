import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class DiscordOAuth2Credentials {
    @PrimaryColumn({name: 'discord_id'})
    discordId: string;

    @Column({name: 'access_token'})
    accessToken: string;

    @Column({name: 'refresh_token'})
    refreshToken: string;
}
