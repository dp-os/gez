import axios from 'axios';
import http from 'http';
import https from 'https';

import { Logger } from './logger';

declare module 'axios' {
    export interface AxiosRequestConfig {
        _startTime?: number;
        loggerText?: string;
    }
}

const reZip = /\.zip$/;

export function createRequest() {
    let first = true;
    const request = axios.create({
        httpAgent: new http.Agent({ keepAlive: true }),
        httpsAgent: new https.Agent({ keepAlive: true })
    });
    request.interceptors.request.use((axiosConfig) => {
        axiosConfig._startTime = Date.now();
        return axiosConfig;
    });

    request.interceptors.response.use(
        async (axiosConfig) => {
            const time = Date.now() - (axiosConfig.config._startTime || 0);
            const url = axiosConfig.config.url || '';
            if (reZip.test(url) || first) {
                Logger.log(`${url} ${time}ms`);
                first = false;
            }
            return Promise.resolve(axiosConfig);
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    return request;
}
