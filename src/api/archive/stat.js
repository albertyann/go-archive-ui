import request from '@/utils/request'

export function hukouStat(data) {
    return request({
        url: '/api/v1/hukou/stat',
        method: 'get',
        data: data
    })
}

