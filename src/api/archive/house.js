import request from '@/utils/request'

// 查询House列表
export function listHouse(query) {
    return request({
        url: '/api/v1/house',
        method: 'get',
        params: query
    })
}

// 查询House详细
export function getHouse (id) {
    return request({
        url: '/api/v1/house/' + id,
        method: 'get'
    })
}


// 新增House
export function addHouse(data) {
    return request({
        url: '/api/v1/house',
        method: 'post',
        data: data
    })
}

// 修改House
export function updateHouse(data) {
    return request({
        url: '/api/v1/house/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除House
export function delHouse(data) {
    return request({
        url: '/api/v1/house',
        method: 'delete',
        data: data
    })
}



