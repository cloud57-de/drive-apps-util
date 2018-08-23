import LoadGoogleApi from "load-google-api";
import { resolve } from "upath";

let debug = false;

export default class DriveAppsUtil {

    constructor(options,logtoconsole) {
        if( logtoconsole != undefined ){
            debug = true;
        }
        this.loadGoogleApi = new LoadGoogleApi(options);
    }

    init() {
        if (debug) console.log("drive-apps-util_init");
        var loadGoogleApi = this.loadGoogleApi;
        return new Promise((resolve, reject) => {
            try{
                loadGoogleApi.loadGoogleAPI().then(
                    () => {
                        loadGoogleApi.init().then(
                            () => {
                                resolve();
                            },
                            (error) => {
                                reject(error);
                            }
                        )
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } catch (e) {
                reject(e);
            }
        });
    }

    login() {
        if (debug) console.log("drive-apps-util_login");
        return new Promise(function (resolve, reject) {
            try{
                var auth = window.gapi.auth2.getAuthInstance();
                if (auth.currentUser.get() == undefined || !auth.currentUser.get().isSignedIn()) {
                    auth.signIn().then(
                        (user) => {
                            resolve(auth.currentUser);
                        },
                        (error) => {
                            reject(error);
                        }
                    )
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
        if (debug) console.log("drive-apps-util_logout");
        window.gapi.auth2.getAuthInstance().currentUser.get().disconnect();
    }

    getDocumentContent(id) {
        if (debug) console.log("drive-apps-util_getDocumentContent");
        return new Promise((resolve, reject) => {
            try{
                gapi.client.request({ 'path': 'https://www.googleapis.com/drive/v3/files/' + id, 'params': { 'alt': 'media' } })
                    .then(
                        (response) => {
                            resolve(response.body);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
            } catch (e) {
                reject(e);
            }
        });
    }

    getDocumentMeta(id) {
        if (debug) console.log("drive-apps-util_getDocumentMeta");
        return new Promise((resolve, reject) => {
            try {
                gapi.client.request({ 'path': 'https://www.googleapis.com/drive/v3/files/' + id, 'params': { 'supportsTeamDrives': true } })
                    .then(
                        (response) => {
                            let fileinfo = JSON.parse(response.body);
                            resolve(fileinfo);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
            } catch (e) {
                reject(e);
            }
        });
    }

    updateDocumentMeta(id, metadata) {
        if (debug) console.log("drive-apps-util_updateDocumentMeta");
        return new Promise((resolve, reject) => {
            try {
                gapi.client.request({
                    'method': 'PATCH',
                    'body': metadata,
                    'path': 'https://www.googleapis.com/drive/v3/files/' + id,
                    'params': { 'supportsTeamDrives': true }
                }).then(
                    (response) => {
                        let fileinfo = JSON.parse(response.body);
                        resolve(fileinfo);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } catch(e) {
                reject(e);
            }
        });
    }

    updateDocument(id, metadata, content) {
        if (debug) console.log("drive-apps-util_updateDocument");
        return new Promise((resolve, reject) => {
            try {
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
                    }).then(
                        (response) => {
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
                            }).then(
                                (response) => {
                                    let fileinfo = JSON.parse(response.body);
                                    resolve(fileinfo);
                                },
                                (error) => {
                                    reject(error);
                                }
                            );
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                }
                else {
                    gapi.client.request({
                        'method': 'PATCH',
                        'body': metadata,
                        'path': 'https://www.googleapis.com/drive/v3/files/' + id,
                        'params': {
                            'supportsTeamDrives': true
                        }
                    }).then(
                        (response) => {
                            let fileinfo = JSON.parse(response.body);
                            resolve(fileinfo);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    createDocument(metadata, content) {
        if (debug) console.log("drive-apps-util_createDocument");
        return new Promise((resolve, reject) => {
            try {
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
                    }).then(
                        (response) => {
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
                            }).then(
                                (response) => {
                                    let fileinfo = JSON.parse(response.body);
                                    resolve(fileinfo);
                                },
                                (error) => {
                                    reject(error);
                                }
                            );
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                }
                else {
                    gapi.client.request({
                        'method': 'POST',
                        'body': metadata,
                        'path': 'https://www.googleapis.com/drive/v3/files',
                        'params': {
                            'supportsTeamDrives': true
                        }
                    }).then(
                        (response) => {
                            let fileinfo = JSON.parse(response.body);
                            resolve(fileinfo);
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                }
            } catch (e) {
                reject(e);
            }
        });
    }

}
