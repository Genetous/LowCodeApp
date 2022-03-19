import React from 'react';
export const domain = process.env.REACT_APP_DOMAIN
export const organization = {
    application_id: process.env.REACT_APP_APPLICATIONID,
    organization_id: process.env.REACT_APP_ORGANIZATIONID,
}
const uconfig = {
    onUploadProgress: progressEvent => console.log(progressEvent.loaded)
}
const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: "" },
    body: ""
};
const requestOptionsFile = {
    method: 'POST',
    headers: { Authorization: "" },
    body: null
};
export const Methods = {
    AddCollection: domain + ':5004/add/collection',
    AddUniqueCollection: domain + ':5004/add/unique/collection',
    AddMultiCollection: domain + ':5004/add/multicollection',
    AddRelation: domain + ':5004/add/relation',
    AddNestedRelation: domain + ':5004/add/nested_relation',
    UpdateCollection: domain + ':5004/update/collection',
    GetCollection: domain + ':5004/get/collection',
    GetCollections: domain + ':5004/get/collections',
    GetRelations: domain + ':5004/get/relations',
    RemoveRelation: domain + ':5004/remove/relation',
    DeleteRelation: domain + ':5004/delete/relation',
    DeleteCollection: domain + ':5004/delete/collection',
    SelectRelation: domain + ':5004/select/relation',
    Search: domain + ':5004/search',
    FileUpload: domain + ':5002/upload/file',
    DeleteFile: domain + ':5002/delete',
    GetFileList: domain + ':5002/get/list',
    StreamFileUpload: domain + ':5002/upload/videostream',
    DownloadFile: domain + ':5002/',
    SendMail: domain + ':5001/send/mail',
    SendMobileNotification: domain + ':5001/send/notification',
    SendDBJob: domain + ':5003/add/dbjob',
    MapCollectionAnalytics: domain + ':5014/map'
}
export const MethodTypes = [
    {
        method:"AddCollection",
        url: domain + ':5004/add/collection',
        type:"Collection",
        mobileMethod:"addCollection"
    },
    {
        method:"AddRelation",
        url: domain + ':5004/add/relation',
        type:"Relation",
        mobileMethod:"addRelation"
    },
    {
        method:"UpdateCollection",
        url: domain + ':5004/update/collection',
        type:"Collection",
        mobileMethod:"updateCollection"
    },
    {
        method:"DeleteRelation",
        url: domain + ':5004/delete/relation',
        type:"Relation",
        mobileMethod:"deleteRelation"
    },
    {
        method:"DeleteCollection",
        url: domain + ':5004/delete/collection',
        type:"Collection",
        mobileMethod:"deleteCollection"
    }
]
async function setTokenToLocalStorage(token) {
    localStorage.setItem('token', token)
}
export async function verify() {

    try {
        requestOptions.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
        const verifyd = await fetch(domain + ':5008/verify', requestOptions)
        const d = await verifyd.json();
        if ('success' in d) {
            return false
        }
    } catch (err) {
        return false
    }
    return true
}

export var promise = new Promise((resolve, reject) => {

    let name = 'Dave'

    if (name === 'Dave') {
        resolve("Promise resolved successfully");
    }
    else {
        reject(Error("Promise rejected"));
    }
});

export var login = function (loginModel, operationStep) {
    return new Promise(async function (resolve, reject) {
        try {
            requestOptions.body = JSON.stringify(organization)

            var hata = "";
            const responseClient = await fetch(domain + ':5008/client', requestOptions)
            const c = await responseClient.json()
            requestOptions.body = JSON.stringify(c)
            const responseAuth = await fetch(domain + ':5008/auth', requestOptions)
            const a = await responseAuth.json()
            if (operationStep === 0) {
                requestOptions.headers.Authorization = `Bearer ${a.token}`
                requestOptions.body = JSON.stringify(loginModel)
                const responseCollection = await fetch(
                    domain + ':5004/get/collection',
                    requestOptions
                )
                const d = await responseCollection.json()
                organization.client_id = d.id
                localStorage.setItem('role', d.content.role)
                await login(organization, 1).then(function (result) {
                    resolve(responseCollection.json());
                }, err => {
                    reject(err);
                });
            } else {
                setTokenToLocalStorage(a.token)
                localStorage.setItem('client_id', organization.client_id)
                localStorage.setItem('organization_id', organization.organization_id)
                localStorage.setItem('application_id', organization.application_id)
                resolve(true);
            }
        } catch (err) {
            reject(err)
        }
    });
}
export var post = function (model, method) {
    return new Promise(async function (resolve, reject) {
        try {
            requestOptions.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
            requestOptions.body = JSON.stringify(model)
            var rdata = null
            const responseCollection = await fetch(
                method,
                requestOptions
            )
            var d = null
            try {
                d = await responseCollection.json()
                resolve(d);
            } catch (err) {
                if (responseCollection.status === 200) {
                    resolve("success");
                } else if (responseCollection.status === 400) {
                    reject("Not Found")
                } else if (responseCollection.status === 403) {
                    reject("Session Timeout")
                }

            }


        } catch (err) {
            reject(err)
        }
    });
}
export var fileUpload = function (file, method, config) {
    return new Promise(async function (resolve, reject) {
        try {
            const data = new FormData()
            data.append('file', file)
            data.append('bucket', organization.application_id)
            let request = new XMLHttpRequest();
            request.open('POST', method);

            request.upload.addEventListener("progress", function (e) {
                let percent_completed = (e.loaded / e.total) * 100;
                config(Math.round(percent_completed))
            });

            request.addEventListener('load', function (e) {
                resolve(request.response)
            });

            request.send(data);
        } catch (err) {
            reject(err)
        }
    });
}
export var fileDownload = function (file, method) {
    return new Promise(async function (resolve, reject) {
        try {
            requestOptionsFile.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
            const responseCollection = await fetch(
                method + file,
                requestOptionsFile
            )
            resolve(responseCollection.data);
        } catch (err) {
            reject(err)
        }
    });
}