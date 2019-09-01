import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//挂在变量
Vue.prototype.serverURL = "https://www.imovietrailer.com/superhero"


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
