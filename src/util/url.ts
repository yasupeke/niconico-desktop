export function getUrlParam(param: string): string {
    const pair = location.search.substring(1).split('&');
    const urlParam = {};
    for(let i = 0; pair[i]; i++) {
        const kv = pair[i].split('=');
        urlParam[kv[0]] = kv[1];
    }
    return urlParam[param];
}