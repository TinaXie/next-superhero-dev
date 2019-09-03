<template>
	<view class="body">
		<form @submit="formSubmit">
			<view class="face-wapper">
				<image src="../../static/icos/default-face.png"
				 class="face"></image>
			</view>
			<view class="info-wapper">
				<label class="words-lbl">账号</label>
				<input 
				type="text" 
				value="" 
				class="input"
				name="username" 
				placeholder="请输入用户名"
				placeholder-class="graywords"
				/>
			</view>
			<view class="info-wapper">
				<label class="words-lbl">密码</label>
				<input 
				type="text" 
				value="" 
				password="true"
				class="input"
				name="password" 
				placeholder="请输入密码"
				placeholder-class="graywords"
				/>
			</view>
			<button type="primary" form-type="submit" class="loginbutton">注册登录</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			//注册登录
			formSubmit(e){
				var me = this;
				var formData = e.detail.value;
				var username = formData.username;
				var password = formData.password;
				
				//发送注册登录请求
				uni.showLoading({
					title:"登录中..."
				})
				uni.request({
					url:me.serverURL + "/user/registOrLogin?&qq=843002185",
					data:{
						"username":username,
						"password":password
					},
					method:"POST",
					success: (res) => {
						if(res.data.status == 200){
							var userInfo = res.data.data;
							//同步保存用户信息到全局中
							uni.setStorageSync("globalUser", userInfo);
							uni.switchTab({
								url:"../me/me"
							});
						}
					},
					complete: () => {
						uni.hideLoading();
					}
					
				});
			}
		}
	}
</script>

<style>
	@import url("registLogin.css");
</style>
