export class UrlUtils {
    static makeQueryUrl(url: string, params: object) {
        if (Object.keys(params).length == 0) {
            return url;
        }
        let query = '';
        for (const key in params) {
            query += key + '=' + params[key] + '&';
        }
        query = query.substr(0, query.length - 1);
        return url + '?' + query;
    }
}