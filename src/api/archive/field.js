import request from '@/utils/request'

// 查询FarmerLand列表
export function listFarmerLand(query) {
    return request({
        url: '/api/v1/farmer-land',
        method: 'get',
        params: query
    })
}

// 查询FarmerLand详细
export function getFarmerLand (id) {
    return request({
        url: '/api/v1/farmer-land/' + id,
        method: 'get'
    })
}


// 新增FarmerLand
export function addFarmerLand(data) {
    return request({
        url: '/api/v1/farmer-land',
        method: 'post',
        data: data
    })
}

// 修改FarmerLand
export function updateFarmerLand(data) {
    return request({
        url: '/api/v1/farmer-land/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除FarmerLand
export function delFarmerLand(data) {
    return request({
        url: '/api/v1/farmer-land',
        method: 'delete',
        data: data
    })
}

