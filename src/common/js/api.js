import { URL } from '@/common/js/url'

import axios from 'axios'
// 封装通用的axios.post
const axiosPost = (url, data) => {
  let dataStr = data
  return axios.post(url, dataStr)
}
// 封装通用的axios.get
const axiosGet = (url, data) => {
  // config.params = data;
  return axios.get(url, { params: data })
} 
// ----------------------首页------------------
/* H5查询自己账号的管理群组 */

export const getManageServices = data => axiosGet(URL + '/h5/manager/getManageServices', data)
// ----------------------end------------------

// -------------------- 反馈中心----------------
//H5查询反馈中心首页数据接口
export const findFeedbacks = data => axiosGet(URL + '/h5/manager/findFeedbacks', data)
//H5查询反馈中心首页数据接口
export const findUserMessageByService = data => axiosGet(URL + '/h5/manager/findUserMessageByService', data)
//H5查询反馈中心首页数据接口
export const findBoxMessageDetail = data => axiosGet(URL + '/h5/manager/findBoxMessageDetail', data)

export const saveOrUpdateReplyTemplate = data => axiosPost(URL + '/h5/manager/saveOrUpdateReplyTemplate', data)

export const getReplyTemplates = data => axiosGet(URL + '/h5/manager/getReplyTemplates', data)

export const deleteReplyTemplate = data => axiosPost(URL + '/h5/manager/deleteReplyTemplate', data)
// 发送消息
export const sendMessage = data => axiosPost(URL + '/h5/manager/sendMessage', data)




// -------------------- 反馈中心end----------------

// ----------------------通讯录-----------------
export const getAcademies = data => axiosGet(URL + '/h5/manager/getAcademiesAndUsers', data)
export const getLabels = data => axiosGet(URL + '/h5/manager/getLabelsAndUsers', data)
export const findUsersByAcademy = data => axiosGet(URL + '/h5/manager/findUsersByAcademy', data)
export const findUsersByLabel = data => axiosGet(URL + '/h5/manager/findUsersByLabel', data)
export const getUserDetail = data => axiosGet(URL + '/h5/manager/getUserDetail', data)
export const getSendObjects = data => axiosGet(URL + '/h5/manager/getSendObjects', data)
