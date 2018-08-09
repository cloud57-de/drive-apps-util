import LoadGoogleApi from "load-google-api";
import { resolve } from "upath";

export default class DriveAppsUtil {

    constructor(options) {
        this.loadGoogleApi = new LoadGoogleApi(options);
        
    }

    init() {
        var loadGoogleApi = this.loadGoogleApi;
        return new Promise((resolve, reject) => {
            loadGoogleApi.loadGoogleAPI().then(() => {
                loadGoogleApi.init().then(() => {
                    resolve();
                });
            });
        });
    }

    login() {
        console.log("login"); 
        return new Promise(function (resolve, reject) {
            var auth = window.gapi.auth2.getAuthInstance();
            if (auth.currentUser.get() == undefined || !auth.currentUser.get().isSignedIn()) {
              auth.signIn().then((user) => {
                resolve(user);
              });
            }
            else {
                resolve(auth.currentUser);
            }
        });
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

    updateDocumentMeta(fileinfo) {
        
    }

}

