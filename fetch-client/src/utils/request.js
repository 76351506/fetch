import fetch from "./fetch";
const getToken = () => "123mutouren";

//拦截请求
fetch.interceptor.request.use(config => {
    if (getToken) {
        config.headers = {
            Authrazation: getToken()
        };
    }
    return config;
});
//拦截响应
fetch.interceptor.response.use(response => {
    switch (response.status) {
        case 401:
            console.log(response.statusText)
            break;
        case 404:
            console.log(response.statusText)
            break;
        case 500:
            console.log(response.statusText)
            break;
    }
    return response.json();
});

export default fetch;