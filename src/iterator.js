
export var Iterate = function (item, strd, keyval, counter, jname) {
    return new Promise(async function (resolve, reject) {
        try {
            counter++
            for (var i = 0; i < Object.keys(item).length; ++i) {
                var key = Object.keys(item)[i]
               
                var isJArray = Object.prototype.toString.call(item[key]) === '[object Array]'
                var isObject = Object.prototype.toString.call(item[key]) === '[object Object]'
                if (isJArray) {
                    var jn = "j_" + String(key) + "_" + String(counter)
                    strd = strd.concat("JSONArray j_" + String(key) + "_" + String(counter) + " = new JSONArray();\n")
                    var vc = item[key]
                    for (var c = 0; c < vc.length; ++c) {

                        var el = vc[c]

                        var isObjectA = Object.prototype.toString.call(el) === '[object Object]'
                        var isJArrayA = Object.prototype.toString.call(el) === '[object Array]'
                        if (isObjectA) {
                            counter++
                            strd = strd.concat("JSONObject jo_" + String(key) + "_" + String(counter) + " = new JSONObject();\n")
                            var s = await Iterate(el, "", "jo_" + String(key) + "_" + String(counter), counter, jn)
                            strd = strd.concat(s)
                            strd = strd.concat(jn + ".put(jo_" + String(key) + "_" + String(counter) + ");\n")
                        } else if (isJArrayA) {
                            strd = strd.concat("JSONArray ja_" + String(key) + "_" + String(counter) + " = new JSONArray();\n")
                            var s = await Iterate(el, "", "ja_" + String(key) + "_" + String(counter), counter, jn)
                            strd = strd.concat(s)
                            strd = strd.concat(keyval + ".put(\"" + key + "\"," + key + ");\n")
                        } else {
                            strd = strd.concat("j_" + String(key) + "_" + String(counter) + ".put(\"" + el + "\");\n")
                        }

                    }
                    strd = strd.concat(keyval + ".put(\"" + key + "\"," + jn + ");\n")
                } else if (isObject) {
                    var k=key
                    if(key.indexOf(".")>0){
                        k=key.replace(".","_");
                    }
                    var len =strd.split("JSONObject " + String(k) + " = new JSONObject();").length - 1
                    if(len>0){
                        k=k+"_"+(len).toString()
                    }
                    strd = strd.concat("JSONObject " + String(k) + " = new JSONObject();\n")
                    var s = await Iterate(item[key], "", k, counter, "")
                    strd = strd.concat(s)
                    strd = strd.concat(keyval + ".put(\"" + key + "\"," + k + ");\n")
                    

                }
                else {
                    var k = ""
                    if (key == "endpoint") {
                        k = "PostGet.URL_TYPE." + this.state.MethodType.mobileMethod
                        var r = "Methods." + this.state.MethodType.method
                        this.setState({ shownURLReact: r })

                        if (await isString(item[key]))
                            strd = strd.concat(keyval + ".put(\"" + key + "\"," + k + ");\n")
                        else
                            strd = strd.concat(keyval + ".put(\"" + key + "\"," + k + ");\n")
                    } else {
                        if (await isString(item[key]))
                            strd = strd.concat(keyval + ".put(\"" + key + "\",\"" + item[key] + "\");\n")
                        else
                            strd = strd.concat(keyval + ".put(\"" + key + "\"," + item[key] + ");\n")
                    }

                }
            }
            resolve(strd)

        } catch (err) {
            reject(err)
        }
    });
}
async function isString(value) {
    return typeof value === 'string' || value instanceof String;
}
export var setReact = function (item) {
    return new Promise(async function (resolve, reject) {
        try {
            var js = item
            var sc = JSON.stringify(js, null, 4)
            if (sc === "null") {
                sc = "{}"
            }
            resolve(sc)

        } catch (err) {
            reject(err)
        }
    });
}
export var IterateiOS = function (data) {
    return new Promise(async function (resolve, reject) {
        try {
            let u = ["AddCollection", "AddRelation", 
            "UpdateCollection", "DeleteRelation", "DeleteCollection",
            "GetCollections","GetCollection","GetRelations"]
            let l = ["addCollection", "addRelation", 
            "updateCollection", "deleteRelation", "deleteCollection",
            "getCollections","getCollection","getRelations"]
            if (data.toString().indexOf('"endpoint": Methods.') > -1) {
                for (var i = 0; i < u.length; ++i) {
                    if (data.toString().indexOf('"endpoint": Methods.' + u[i]) > -1) {
                        data = data.replace('"endpoint": Methods.'+u[i], '"endpoint": URL_TYPE.' + l[i]+'.description')
                    }
                }
                var sc = replaceAll(data, "{", "[")
                sc = replaceAll(sc, "}", "]")
                resolve(sc)
            }else if (data.toString().indexOf('"endpoint": "Methods.') > -1) {
                for (var i = 0; i < u.length; ++i) {
                    if (data.toString().indexOf('"endpoint": "Methods.' + u[i]) > -1) {
                        data = data.replace('"endpoint": "Methods.'+u[i]+'"', '"endpoint": URL_TYPE.' + l[i]+'.description')
                    }
                }
                var sc = replaceAll(data, "{", "[")
                sc = replaceAll(sc, "}", "]")
                resolve(sc)
            }
             else {
                var sc = replaceAll(data, "{", "[")
                sc = replaceAll(sc, "}", "]")
                resolve(sc)
            }
        } catch (err) {
            reject(err)
        }
    });
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}