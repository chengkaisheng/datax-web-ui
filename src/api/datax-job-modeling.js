import request from '@/utils/request'


export function Getlist(id) {
  return request({
    url: '/api/jobModel/tree',
    method: 'get',
    params: id
  })
}

export function Newtable(data) {
  return request({
    url: '/api/jobModel/save',
    method: 'post',
    data: data
  })
}

export function DeleteTable(data) {
  return request({
    url: '/api/jobModel/delete',
    method: 'post',
    params: data
  })
}

export function Update(data) {
  return request({
    url: '/api/jobModel/update',
    method: 'post',
    data: data
  })
}
