import request from '@/utils/request'

// 查询TbLand列表
export function listTbLand(query) {
    return request({
        url: '/api/v1/land',
        method: 'get',
        params: query
    })
}

export function exportLand(query) {
    return request({
        url: '/api/v1/land/export',
        method: 'get',
        params: query
    })
}


// 查询TbLand详细
export function getTbLand (id) {
    return request({
        url: '/api/v1/land/' + id,
        method: 'get'
    })
}


// 新增TbLand
export function addTbLand(data) {
    return request({
        url: '/api/v1/land',
        method: 'post',
        data: data
    })
}

// 修改TbLand
export function updateTbLand(data) {
    return request({
        url: '/api/v1/land/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除TbLand
export function delTbLand(data) {
    return request({
        url: '/api/v1/land',
        method: 'delete',
        data: data
    })
}

