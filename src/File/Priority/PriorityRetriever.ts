import {MyFile} from "../MyFile";

export type Priority = number;
export interface PriorityRetriever {
    getPriority(file: MyFile): Priority

    suits(file: MyFile): boolean;
}
