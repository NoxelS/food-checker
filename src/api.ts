import axios, { AxiosRequestConfig } from 'axios';

import { Cache } from './cache';
import { getDefaultOptions } from './helper';


export async function sendRequest(url, options?: AxiosRequestConfig) {
    if (!!Cache.get(url)) {
        console.log("Using cache...");
        return Cache.get(url);
    } else {
        console.log("Sending a real request...");
        const res = await axios(url, options || getDefaultOptions());
        Cache.store(url, res.data);
        return res.data;
    }
}
