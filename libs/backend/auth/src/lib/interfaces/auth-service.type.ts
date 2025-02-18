import type {User} from '@backend/db';
import type {
    FindOAuth2Params,
    FindUserParams,
    OAuth2Details,
    UserDetails,
} from './auth.types';

export interface IAuthService {
    validateUser(details: UserDetails): Promise<User>;
    createUser(details: UserDetails): Promise<User>;
    updateUser(user: User, details: UserDetails): Promise<User>;
    findUser(params: FindUserParams): Promise<User | null>;
    validateOAuth2(details: OAuth2Details): Promise<OAuth2Details>;
    createOAuth2(details: OAuth2Details): Promise<OAuth2Details>;
    updateOAuth2(details: OAuth2Details): Promise<OAuth2Details>;
    findOAuth2(params: FindOAuth2Params): Promise<OAuth2Details | null>;
}
