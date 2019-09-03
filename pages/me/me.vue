<template>
	<view class="page page-fill">
		<view class="header">
			<view v-if="userIsLogin">
				<image :src="userInfo.faceImage" class="face"></image>
			</view>
			<view v-else>
				<!-- 未登录 -->
				<image src="/static/icos/108x108.png" class="face"></image>
			</view>
			<view class="info-wapper" v-if="userIsLogin">
				<view class="nickname">{{userInfo.nickname}}</view>
				<view class="nav-info">ID: {{userInfo.id}}</view>
			</view>
			<view v-else>
				<navigator url="../registLogin/registLogin">
					<view class="nickname regist-login">注册/登录</view>
				</navigator>
			</view>
			
			<view class="set-wapper" v-if="userIsLogin">
				<image src="/static/icos/settings.png"
				 class="settings"
				 @click="goToMeInfo"></image>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userIsLogin: false ,//用户是否登陆
				userInfo:{}	//用户信息
			}
		},
		onLoad() {

		},
		onShow() {
			var me = this;
			
			// 使用挂载方法获取用户数据
			var userInfo = me.getGlobalUser();
			if (userInfo != null && userInfo != "" && userInfo != undefined) {
				me.userInfo = userInfo;
				me.userIsLogin = true;
			} else {
				me.userIsLogin = false;
			}
		},
		methods: {
			goToMeInfo(){
				uni.navigateTo({
					url:"../meInfo/meInfo"
				});
			}
		}
	}
</script>

<style>
	@import url("me.css");
</style>
