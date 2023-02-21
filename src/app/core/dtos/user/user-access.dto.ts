import { UserPermission } from "../../enums/user-permission";

export interface UserAccessDto {
    accessToken: string,
    permission: UserPermission,
    issuedAt: Date
}