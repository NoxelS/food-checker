import { AxiosRequestConfig, Method } from 'axios';


export function getDefaultHeaders() {
    return {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'de',
        'X-Country-Code': 'de',
        'X-Session-ID': 'f7dcd35f-dca9-41db-ae9e-b24e17939379',
        'CW-True-IP': '95.90.216.127',
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: process.env.auth as string,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-GPC': '1',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache'
    };
}

export function getDefaultOptions(): AxiosRequestConfig {
    return <AxiosRequestConfig>{
        withCredentials: true,
        headers: getDefaultHeaders(),
        method: 'GET' as Method
    };
}