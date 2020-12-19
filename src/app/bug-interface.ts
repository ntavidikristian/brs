import { Comment } from "./comment";

export interface BugInterface {
    id?: string;  
    title: string;  
    description: string;
    priority: number;
    reporter: string;
    status?: string;
    updatedAt?: string;
    createdAt?: string;
    comments?: Array<Comment>;
}
