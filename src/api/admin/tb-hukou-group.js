import request from '@/utils/request'

// 查询TbHukouGroup列表
export function listTbHukouGroup(query) {
    return request({
        url: '/api/v1/tb-hukou-group',
        method: 'get',
        params: query
    })
}

// 查询TbHukouGroup详细
export function getTbHukouGroup (id) {
    return request({
        url: '/api/v1/tb-hukou-group/' + id,
        method: 'get'
    })
}


// 新增TbHukouGroup
export function addTbHukouGroup(data) {
    return request({
        url: '/api/v1/tb-hukou-group',
        method: 'post',
        data: data
    })
}

// 修改TbHukouGroup
export function updateTbHukouGroup(data) {
    return request({
        url: '/api/v1/tb-hukou-group/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除TbHukouGroup
export function delTbHukouGroup(data) {
    return request({
        url: '/api/v1/tb-hukou-group',
        method: 'delete',
        data: data
    })
}

