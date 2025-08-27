export interface IApiRequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}

// API Response Interface
export interface IApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    ok: boolean;
}

export interface ResultSet {
    insertId: number;
    rowsAffected: number;
    rows: ResultSetRowList;
}

export interface ResultSetRowList {
    length: number;
    raw(): any[];
    item(index: number): any;
}