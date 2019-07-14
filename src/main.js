import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css';
import { Tabs, TabPane } from 'element-ui';
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
