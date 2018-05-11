
import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      // redirect: '/NewsSend'
      redirect: '/inbox'
    },

    {
      path: '/',
      component: resolve => require(['../components/Index'], resolve),
      children: [
        {
          path: '/inbox',
          component: resolve => require(['../components/inbox/inbox'], resolve)
        },
        {
          path: '/index',
          component: resolve => require(['../components/nav'], resolve)
        },
        {
          path: '/NewsSend',
          component: resolve => require(['../components/newsSend'], resolve)
        },
        // 反馈中心-消息列表
        {
          path: '/FeedBack',
          component: resolve => require(['../components/feedBack'], resolve)
        },
        // 反馈中心-用户列表
        {
          path: '/feedBack_userList',
          name: '/feedBack_userList',
          component: resolve => require(['../components/feedBack_userList'], resolve)
        },
        // 反馈中心-对话页面
        {
          path: '/feedBack_detail',
          name: '/feedBack_detail',
          component: resolve => require(['../components/feedBack_detail'], resolve),

        },
        // 反馈中心-编辑模板页
        {
          path: '/feedBack_addTemplate',
          name: '/feedBack_addTemplate',
          component: resolve => require(['../components/feedBack_addTemplate'], resolve)
        },
        // 通讯录 - 首页
        {
          path: '/mailList',
          name: '/mailList',
          component: resolve => require(['../components/mailList'], resolve)
        },
        // 通讯录 - 首页
        {
          path: '/mailList_forChoose',
          name: '/mailList_forChoose',
          component: resolve => require(['../components/mailList_forChoose'], resolve)
        },
        // 通讯录 - 用户列表
        {
          path: '/mailList_userList',
          name: '/mailList_userList',
          component: resolve => require(['../components/mailList_userList'], resolve)
        },
        // 通讯录 - 用户详情
        {
          path: '/mailList_userDetail',
          name: '/mailList_userDetail',
          component: resolve => require(['../components/mailList_userDetail'], resolve),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/Material',
          component: resolve => require(['../components/material'], resolve)
        },
        {
          path: '/Template',
          component: resolve => require(['../components/template'], resolve)
        },
        // 发送历史
        {
          path: '/history',
          component: resolve => require(['../components/history'], resolve),
          children: [
            { path: '/history/hiSend', component: resolve => require(['../components/hisSend'], resolve) },
            { path: '/hisWaitCheck', component: resolve => require(['../components/hisWaitCheck'], resolve) },
            { path: '/hisGoCheck', component: resolve => require(['../components/hisGoCheck'], resolve) },
            { path: '/hisFail', component: resolve => require(['../components/hisFail'], resolve) }
          ]
        },
        {
          path: '/showMassage',
          component: resolve => require(['../components/common/showMassage'], resolve)
        },
        {
          path: '/allData',
          component: resolve => require(['../components/allData'], resolve)
        },
        {
          path: '/receiptReply',
          component: resolve => require(['../components/receiptReply'], resolve)
        },
        {
          path: '/Template',
          component: resolve => require(['../components/template'], resolve)
        },
        {
          path: '/Channel',
          component: resolve => require(['../components/channel'], resolve)
        },
        {
          path: '/WaitAudit',
          component: resolve => require(['../components/waitAudit'], resolve)
        },
        // 个人中心
        {
          path: '/personal',
          component: resolve => require(['../components/personal/personal'], resolve)
        },

      ]
    },


  ]
})




