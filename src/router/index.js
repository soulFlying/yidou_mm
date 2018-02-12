import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index/index'
import payment from '@/components/payment/payment'
import paySuccess from '@/components/pay_success/pay_success'
import noOrder from '@/components/no_order/no_order'
import orderLists from '@/components/order_lists/order_lists'
import detail from '@/components/order_detail/order_detail'
import form from '@/components/order_form/order_form'
import bills from '@/components/bills/bills'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/detail/:orderId/:btnNum',
      name: 'detail',
      component: detail
    },
    {
      path: '/form',
      name: 'form',
      component: form,
      meta: { keepAlive: true }
    },
    {
      path: '/payment/:orderId/:price',
      name: 'payment',
      component: payment
    },
    {
      path: '/noOrder',
      name: 'noOrder',
      component: noOrder
    },
    {
      path: '/paySuccess/:orderId',
      name: 'paySuccess',
      component: paySuccess
    },
    {
      path: '/orderLists',
      name: 'orderLists',
      component: orderLists
    },
    {
      path: '/bills',
      name: 'bills',
      component: bills
    }
  ]
})
