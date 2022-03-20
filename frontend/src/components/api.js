export const api = (function(){
    "use strict";
    
    function send(method, url, data, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        if (!data) xhr.send();
        else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }
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
            xhr.send(formdata);
        });
    }
    // function sendFiles(method,  url, data, callback){
    //     let formdata = new FormData();
    //     Object.keys(data).forEach(function(key){
    //         let value = data[key];
    //         formdata.append(key, value);
    //     });
    //     let xhr = new XMLHttpRequest();
    //     xhr.onload = function() {
    //         if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
    //         else {
    //             callback(null, JSON.parse(xhr.responseText));
    //         }
    //     };
    //     xhr.open(method, url, true);
    //     xhr.send(formdata);
    // }



    var module = {};
    
    module.addImage = (picture) => {
        return sendFilesPromise("POST", "http://localhost:4000/api/images/", {picture:picture});
    };
    // add an image to the database
    // module.addImage = function(picture, callback){
    //     sendFiles("POST", "http://localhost:4000/api/images/", {picture:picture}, function(err, res){
    //         if (err) return callback(err,null);
    //         else return callback(null,res);
    //     });
    // };
    
    //
    // module.deleteImage = function(imageId, callback){
    //     send("DELETE", "/api/images/" + imageId + "/", null, function(err, res){
    //         if (err) return callback(err);
    //         else return callback(null);
    //     });
    // };
    
    return module;
})();