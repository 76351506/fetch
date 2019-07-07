/*
 * @Author: heinan 
 * @Date: 2019-05-31 10:31:51 
 * @Last Modified by: heinan
 * @Last Modified time: 2019-05-31 16:25:39
 */

let _fetch = fetch;
let interceptor_req = [];
let interceptor_res = []

//设置默认请求参数
let defaultConfig = {
    mode: 'cors',    // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    credentials: 'same-origin', // include, same-origin, *omit
    referrer: "no-referrer"  // *client, no-referrer
}
// GET请求方式，序列化config.data传递过来的参数
const formate = (data) => {
    return Object.entries(data).map(item => item.join('=')).join('&')
}

window.fetch = (url, config = defaultConfig) => {
    config = {
        ...defaultConfig,
        ...config
    }
    if (config.method === 'POST') {
        // 判断前端传递的数据是不是文件上传FormData
        if (!(config.body instanceof FormData)) {
            config.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf8',
                ...config.headers,
            }
            /** 
             * config.data 前端向后端传递的数据
             * config.body fetch API post传参方式，并需要转为JSON字符串
            */
            config.body = JSON.stringify(config.data)
        } else {
            //如果是表单上传，设置请求头 Accept
            config.headers = {
                'Accept': 'multipart/form-data',
                ...config.headers,
            }
            config.body = config.FormData;
        }
    }
    //如果是 GET请求，将config.data传递过来的数据，序列化为 URL查询字符串，拼接上去
    if (config.method === 'GET') {
        url += url.includes('?') ? formate(config.data) : '?' + formate(config.data)
    }
    //在请求数据之前调用 "请求拦截" 完成全局配置
    interceptor_req.forEach(interceptor => {
        config = interceptor(config)
    })
    return new Promise((resolve, reject) => {
        _fetch(url, config).then(result => {
            //在请求数据之后调用 "响应拦截" 完成特殊业务逻辑处理
            interceptor_res.forEach(interceptor => {
                result = interceptor(result)
            })
            resolve(result)
        }).catch(error => {
            reject(error)
        })
    })
}

fetch.interceptor = {
    request: {
        use: (callback) => {
            interceptor_req.push(callback)
        }
    },
    response: {
        use: (callback) => {
            interceptor_res.push(callback)
        }
    }
}

export default fetch;

