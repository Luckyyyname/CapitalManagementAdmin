import { postRequest } from '@/http/http'

export const submitTrigger = function (data) {
    return postRequest('/api/triggers/add', data);
}
