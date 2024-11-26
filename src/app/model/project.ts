import {User} from "./user";

export type Project = {
    id?: number;
    name: string;
    description: string;
    owner: User;
    createdAt?: Date;
    updatedAt?: Date;
}
