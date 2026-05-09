import request from '@/utils/request'

// 查询Contract列表
export function listContract(query) {
    return request({
        url: '/api/v1/contract',
        method: 'get',
        params: query
    })
}

// 查询Contract详细
export function getContract (id) {
    return request({
        url: '/api/v1/contract/' + id,
        method: 'get'
    })
}


// 新增Contract
export function addContract(data) {
    return request({
        url: '/api/v1/contract',
        method: 'post',
        data: data
    })
}

// 修改Contract
export function updateContract(data) {
    return request({
        url: '/api/v1/contract/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除Contract
export function delContract(data) {
    return request({
        url: '/api/v1/contract',
        method: 'delete',
        data: data
    })
}

