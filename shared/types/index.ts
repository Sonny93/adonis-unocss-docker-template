import { UserAuthDto } from '#dtos/user_auth';

export type UserAuth = ReturnType<UserAuthDto['serialize']>;
