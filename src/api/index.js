import { getRequest, postRequest, deleteRequest } from '@/http/http'

export const getTableList = function () {
    return getRequest('/api/profiles');
}

export const addData = function (data) {
    return postRequest('/api/profiles/add', data);
}

export const editData = function (id, data) {
    return postRequest(`/api/profiles/edit/${id}`, data);
}

export const deleteData = function (id) {
    return deleteRequest(`/api/profiles/delete/${id}`);
}
