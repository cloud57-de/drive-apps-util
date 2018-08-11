import DriveAppsUtil from "../src/driveappsutil.js";

let options = {
    "clientId": "145940141011-s38iu25hk8guo3tssbhfncfljn53i19k.apps.googleusercontent.com",
    "scope": [
      "profile",
      "https://www.googleapis.com/auth/drive",
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


window.updateContent = () => {
    let metadata = JSON.stringify({
        name: document.getElementById('name').value,
        mimeType: "application/bpmn+xml"
    });

    driveAppsUtil.updateDocument('0B-K7oJWHTbZ8RjZ0LWhEM3JQbm8', metadata, document.getElementById('content').value)
    .then((fileinfo) => {document.getElementById('updatedocumentcontent').textContent=JSON.stringify(fileinfo);});
}

window.updateOnlyMetadata = () => {
    let metadata = JSON.stringify({
        name: document.getElementById('name').value,
        mimeType: "application/bpmn+xml"
    });

    driveAppsUtil.updateDocument('0B-K7oJWHTbZ8RjZ0LWhEM3JQbm8', metadata)
    .then((fileinfo) => {document.getElementById('updatedocumentcontent').textContent=JSON.stringify(fileinfo);});
}

window.createContent = () => {
    let metadata = JSON.stringify({
        name: document.getElementById('newname').value,
        mimeType: "text/plain"
    });

    driveAppsUtil.createDocument(metadata, document.getElementById('newcontent').value)
    .then((fileinfo) => {document.getElementById('createdocumentcontent').textContent=JSON.stringify(fileinfo);});
}

window.createOnlyMetadata = () => {
    let metadata = JSON.stringify({
        name: document.getElementById('newname').value
    });

    driveAppsUtil.createDocument(metadata)
    .then((fileinfo) => {document.getElementById('createdocumentcontent').textContent=JSON.stringify(fileinfo);});
}
