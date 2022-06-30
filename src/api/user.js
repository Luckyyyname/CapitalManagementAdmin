import { getRequest, postRequest } from '@/http/http'

export const registerSubmit = function (data) {
    return postRequest('/api/users/register', data)
}

export const loginSubmit = function (data) {
    return postRequest('/api/users/login', data)
}