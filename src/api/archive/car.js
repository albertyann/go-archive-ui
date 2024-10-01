import request from '@/utils/request'

// 查询TbCar列表
export function listTbCar(query) {
    return request({
        url: '/api/v1/car',
        method: 'get',
        params: query
    })
}

// 查询TbCar详细
export function getTbCar (id) {
    return request({
        url: '/api/v1/car/' + id,
        method: 'get'
    })
}


// 新增TbCar
export function addTbCar(data) {
    return request({
        url: '/api/v1/car',
        method: 'post',
        data: data
    })
}

// 修改TbCar
export function updateTbCar(data) {
    return request({
        url: '/api/v1/car/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除TbCar
export function delTbCar(data) {
    return request({
        url: '/api/v1/car',
        method: 'delete',
        data: data
    })
}

