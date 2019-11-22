import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/page/HomePage'
import Blocks from '@/page/Blocks'
import BlockDetail from '@/page/BlockDetail'
import Transactions from '@/page/Transactions'
import TransactionDetail from '@/page/TransactionDetail'
import WalletDetail from '@/page/WalletDetail'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/block',
      name: 'Blocks',
      component: Blocks
    },
    {
      path: '/blockDetail',
      name: 'BlockDetail',
      component: BlockDetail
    },
    {
      path: '/trade',
      name: 'Transactions',
      component: Transactions
    },
    {
      path: '/tradeDetail',
      name: 'TransactionDetail',
      component: TransactionDetail
    },
    {
      path: '/walletDetail',
      name: 'WalletDetail',
      component: WalletDetail
    }
  ]
})
