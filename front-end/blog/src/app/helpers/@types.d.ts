export interface AssignOption {
    override?: boolean;
    key?: string | number;
    deep?: boolean;
}

export type ErrorMessageMap = Map<number | string, string>;