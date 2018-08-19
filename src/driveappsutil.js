import LoadGoogleApi from "load-google-api";
import { resolve } from "upath";

export default class DriveAppsUtil {

    constructor(options) {
        this.loadGoogleApi = new LoadGoogleApi(options);

    }

    init() {
        var loadGoogleApi = this.loadGoogleApi;
        return new Promise((resolve, reject) => {
            try{
                loadGoogleApi.loadGoogleAPI().then(() => {
                    loadGoogleApi.init().then(() => {
                        resolve();
                    }).catch((e) => {
                        reject(e);
                    });
                }).catch((e) => {
                    reject(e);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    login() {
        console.log("login");
        return new Promise(function (resolve, reject) {
            try{
                var auth = window.gapi.auth2.getAuthInstance();
                if (auth.currentUser.get() == undefined || !auth.currentUser.get().isSignedIn()) {
                    auth.signIn().then((user) => {
                        resolve(user);
                    }).catch( (e) => {
                        reject(e);
                    });
                }
                else {
                    resolve(auth.currentUser);
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    logout() {
        console.log("logout");
        window.gapi.auth2.getAuthInstance().currentUser.get().disconnect();
    }

    getDocumentContent(id) {
        console.log("getDocumentContent");
        return new Promise((resolve, reject) => {
            gapi.client.request({ 'path': 'https://www.googleapis.com/drive/v3/files/' + id, 'params': { 'alt': 'media' } })
                .then(function (response) {
                    resolve(response.body);
                },
                    (reason) => {
                        reject(reason);
                    });
        });
    }

    getDocumentMeta(id) {
        console.log("getDocumentMeta");
        return new Promise((resolve, reject) => {
            gapi.client.request({ 'path': 'https://www.googleapis.com/drive/v3/files/' + id, 'params': { 'supportsTeamDrives': true } })
                .then(function (response) {
                    let fileinfo = JSON.parse(response.body);
                    resolve(fileinfo);
                },
                    function (reason) {
                        reject(reason);
                    });
        });

    }

    updateDocumentMeta(id, metadata) {
        console.log("updatemetadata");
        return new Promise((resolve, reject) => {
            gapi.client.request({
                'method': 'PATCH',
                'body': metadata,
                'path': 'https://www.googleapis.com/drive/v3/files/' + id,
                'params': { 'supportsTeamDrives': true }
            }).then((response) => {
                let fileinfo = JSON.parse(response.body);
                resolve(fileinfo);
            });
        });
    }

    updateDocument(id, metadata, content) {
        console.log("updatecontent");
        return new Promise((resolve, reject) => {
            let contentlength = 0;
            if (metadata) {
                contentlength = JSON.stringify(metadata).length;
            }
            if (content) {
                gapi.client.request({
                    'method': 'PATCH',
                    'body': metadata,
                    'path': 'https://www.googleapis.com/upload/drive/v3/files/' + id,
                    'params': {
                        'uploadType': 'resumable', 'supportsTeamDrives': true,
                        'headers': {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Content-Length': contentlength
                        }
                    }
                }).then((response) => {
                    let contentlength = 0;
                    if (content) {
                        contentlength = content.length;
                    }
                    gapi.client.request({
                        'method': 'PUT',
                        'body': content,
                        'path': response.headers.location,
                        'headers': {
                            'Content-Type': metadata.mimeType,
                            'Content-Length': contentlength
                        }
                    }).then((response) => {
                        let fileinfo = JSON.parse(response.body);
                        resolve(fileinfo);
                    });
                });
            }
            else {
                gapi.client.request({
                    'method': 'PATCH',
                    'body': metadata,
                    'path': 'https://www.googleapis.com/drive/v3/files/' + id,
                    'params': {
                        'supportsTeamDrives': true
                    }
                }).then((response) => {
                    let fileinfo = JSON.parse(response.body);
                    resolve(fileinfo);
                });
            }
        });
    }

    createDocument(metadata, content) {
        console.log("createdocument");
        return new Promise((resolve, reject) => {
            let contentlength = 0;
            if (metadata) {
                contentlength = JSON.stringify(metadata).length;
            }
            if (content) {
                gapi.client.request({
                    'method': 'POST',
                    'body': metadata,
                    'path': 'https://www.googleapis.com/upload/drive/v3/files',
                    'params': {
                        'uploadType': 'resumable', 'supportsTeamDrives': true,
                        'headers': {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Content-Length': contentlength
                        }
                    }
                }).then((response) => {
                    let contentlength = 0;
                    if (content) {
                        contentlength = content.length;
                    }
                    gapi.client.request({
                        'method': 'PUT',
                        'body': content,
                        'path': response.headers.location,
                        'headers': {
                            'Content-Type': metadata.mimeType,
                            'Content-Length': contentlength
                        }
                    }).then((response) => {
                        let fileinfo = JSON.parse(response.body);
                        resolve(fileinfo);
                    });
                });
            }
            else {
                gapi.client.request({
                    'method': 'POST',
                    'body': metadata,
                    'path': 'https://www.googleapis.com/drive/v3/files',
                    'params': {
                        'supportsTeamDrives': true
                    }
                }).then((response) => {
                    let fileinfo = JSON.parse(response.body);
                    resolve(fileinfo);
                });
            }
        });
    }

}
