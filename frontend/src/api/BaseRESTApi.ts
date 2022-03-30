export class BaseRESTApi {
    protected static sendRESTCall = async (method: string, data: {},  endpoint: string = '/', baseUrl = process.env.REACT_APP_BACKENDURL) => {
        return new Promise<any>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.onload = function() {
                if (xhr.status !== 200) reject("[" + xhr.status + "]" + xhr.responseText);
                else resolve(JSON.parse(xhr.responseText));
            };
            // @ts-ignore
            xhr.open(method, baseUrl + endpoint, true);
            if (!data) xhr.send();
            else{
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            }
        });
    }
}
