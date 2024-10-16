import request from '@/utils/request'

// 查询TbHouse列表
export function listTbHouse(query) {
    return request({
        url: '/api/v1/tb-house',
        method: 'get',
        params: query
    })
}

// 查询TbHouse详细
export function getTbHouse (id) {
    return request({
        url: '/api/v1/tb-house/' + id,
        method: 'get'
    })
}


// 新增TbHouse
export function addTbHouse(data) {
    return request({
        url: '/api/v1/tb-house',
        method: 'post',
        data: data
    })
}

// 修改TbHouse
export function updateTbHouse(data) {
    return request({
        url: '/api/v1/tb-house/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除TbHouse
export function delTbHouse(data) {
    return request({
        url: '/api/v1/tb-house',
        method: 'delete',
        data: data
    })
}

