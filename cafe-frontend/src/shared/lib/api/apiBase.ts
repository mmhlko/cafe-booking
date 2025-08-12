import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

export class ApiBase {
    protected api: AxiosInstance;

    constructor(config?: CreateAxiosDefaults) {
        this.api = axios.create({
            baseURL: "/",
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60_000,
            ...config,
        });
    }

    protected handleError(error: unknown, action: string): void {
        if (axios.isAxiosError(error) && error.response) {
            console.error(`${action} failed:`, error.response.data);
        } else {
            console.error(`${action} failed:`, error instanceof Error ? error.message : error);
        }
    }
}