import request from '@/utils/request'

// 查询TbMember列表
export function listTbMember(query) {
  return request({
    url: '/api/v1/member',
    method: 'get',
    params: query
  })
}

// 导出
export function exportMember(query) {
  return request({
    url: '/api/v1/member/export',
    method: 'get',
    params: query
  })
}


// 查询TbMember详细
export function getTbMember(id) {
  return request({
    url: '/api/v1/member/' + id,
    method: 'get'
  })
}

export function getFamilyMember(id) {
  return request({
    url: '/api/v1/member/family/' + id,
    method: 'get'
  })
}

// 新增TbMember
export function addTbMember(data) {
  return request({
    url: '/api/v1/member',
    method: 'post',
    data: data
  })
}

// 修改TbMember
export function updateTbMember(data) {
  return request({
    url: '/api/v1/member/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除TbMember
export function delTbMember(data) {
  return request({
    url: '/api/v1/member',
    method: 'delete',
    data: data
  })
}

export function delFamilyMember(data) {
  return request({
    url: '/api/v1/member/family',
    method: 'put',
    data: data
  })
}

