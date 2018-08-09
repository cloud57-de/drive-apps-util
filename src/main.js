import DriveAppsUtil from "./driveappsutil.js";

let options = {
    "clientId": "349923725301-cn75hqucfe63q2r40j1i40oiuocgtpst.apps.googleusercontent.com",
    "scope": [
      "profile",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.metadata.readonly",
      "https://www.googleapis.com/auth/drive.install"
    ]
};
  
let driveAppsUtil = new DriveAppsUtil(options);
driveAppsUtil.init().then(
    () => {
        window.driveAppsUtil = driveAppsUtil;
    },
    reason => {
        console.log(reason);
    }
);
