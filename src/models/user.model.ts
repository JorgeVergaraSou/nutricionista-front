import Roles from "./roles.enum";

export interface UserInfo {
   idUser: number;
    name: string;
    email: string;
    role: Roles;
    token?: string;
}