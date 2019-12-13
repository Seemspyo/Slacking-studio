export interface HttpResultResponse {
    result: number;
}

export interface ItemOption {
    search?: string;
    status?: boolean;
}

export interface AssignOption {
    override?: boolean;
    key?: string | number;
    deep?: boolean;
}