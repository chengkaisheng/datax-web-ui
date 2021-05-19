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
