import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//挂在变量
Vue.prototype.serverURL = "https://www.imovietrailer.com/superhero"

Vue.prototype.getGlobalUser = function(){
	var userInfo = uni.getStorageSync("globalUser");
	if (userInfo != null && userInfo != "" && userInfo != undefined) {
		return userInfo;
	} else{
		return null;
	}
}


App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
