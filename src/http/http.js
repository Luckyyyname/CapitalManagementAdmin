import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus'
import router from '@/router/index'

// 开始和结束加载动画函数
let loading;
const startLoading = () => {
    loading = ElLoading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0,0,0,0.7)'
    });
}
const endLoading = () => {
    loading.close();
}

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
})
// 请求拦截
instance.interceptors.request.use(config => {
    // 加载动画
    startLoading();

    // 有token的需要在请求头加上token
    if (localStorage.eleToken) {
        config.headers.Authorization = localStorage.eleToken;
    }
    return config;
}, error => {
    return Promise.reject(error)
})

// 响应拦截
instance.interceptors.response.use(response => {
    // 结束加载动画
    endLoading();
    return response;
}, error => {
    endLoading();

    //获取错误状态码
    const { status } = error.response;
    // 401跳转登录页面
    if (status == 401) {
        ElMessage.error('Token失效，请重新登录！');
        // 清除过期token
        localStorage.removeItem('eleToken');
        // 跳转登录页面
        router.push("/login");
    } else {
        ElMessage.error(error.response.data);
    }

    return Promise.reject(error);
})

export const getRequest = (url = '', params = {}, config = {}) => {
    return instance({
        method: 'get',
        url,
        params,
        ...config
    }).then(response => {
        return response
    })
}

export const postRequest = (url = '', data = {}, config = {}) => {
    return instance({
        method: 'post',
        url,
        data,
        ...config
    }).then(response => {
        return response
    })
}

export const deleteRequest = (url = '', data = {}, config = {}) => {
    return instance({
        method: 'delete',
        url,
        data,
        ...config
    }).then(response => {
        return response
    })
}