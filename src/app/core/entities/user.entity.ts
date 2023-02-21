import { UserPermission } from "../enums/user-permission";
import { AbstractEntity } from "./abstract.entity";

export interface UserEntity extends AbstractEntity {
    name: string,
    username: string,
    permission: UserPermission
}