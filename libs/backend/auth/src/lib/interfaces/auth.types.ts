import {User} from '@backend/db';

export type UserDetails = {
    discordId: string;
    discordTag: string;
    username: string;
    avatar: string | null | undefined;
    email: string;
};

export type OAuth2Details = {
    discordId: string;
    accessToken: string;
    refreshToken: string;
};

export type FindUserParams = Partial<{
    discordId: string;
    discordTag: string;
    avatar: string;
    email: string;
}>;

export type FindOAuth2Params = Partial<{
    discordId: string;
    accessToken: string;
    refreshToken: string;
}>;

export type Done = (err: Error | null, user: User | null) => void;
