export const api = (function(){
    "use strict";
    
    const sendFilesPromise = (method, url, data) =>{
        return new Promise((resolve, reject) => {
            let formdata = new FormData();
            Object.keys(data).forEach(function(key){
                let value = data[key];
                formdata.append(key, value);
            });
            let xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.status !== 200) return reject("[" + xhr.status + "]" + xhr.responseText);
                else {
                    return resolve(JSON.parse(xhr.responseText));
                }
            };
            xhr.open(method, url, true);
            xhr.withCredentials = true;
            xhr.send(formdata);
        });
    }

    var module = {};
    
    module.addImage = (picture) => {
        return sendFilesPromise("POST", process.env.REACT_APP_BACKENDURL + "/api/images/", {picture:picture});
    };
    
    // module.deleteImage = (imageId) => {
    //     return send("DELETE", process.env.REACT_APP_BACKENDURL + "/api/images/" + imageId + "/", null);
    // };
    
    return module;
})();