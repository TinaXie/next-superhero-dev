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
		<!-- 第三方登录 -->
		<!-- #ifndef H5 -->
		<view class="third-wapper">
			<view class="third-line">
				<view class="single-line">
					<view class="line"></view>
				</view>
				<view class="third-words">第三方账号登录</view>
				<view class="single-line">
					<view class="line"></view>
				</view>
			</view>
			<view class="third-icons-wapper">
				<!-- 5+app 用qq/微信/微博 登录 小程序用微信小程序登录 h5不支持 -->
				
				<!-- #ifdef APP-PLUS -->
				<image src="/static/icos/weixin.png"
				 class="third-icon"
				 data-logintype="weixin"
				  @click="appOAuthLogin" ></image>
				<image src="/static/icos/QQ.png"
				 class="third-icon"
				 data-logintype="qq"
				  @click="appOAuthLogin" ></image>
				  <image src="/static/icos/weibo.png"
				   class="third-icon"
				   data-logintype="sinaweibo"
				    @click="appOAuthLogin" ></image>
				<!-- #endif -->
				
				<!-- #ifdef MP-WEIXIN -->
					<button open-type='getUserInfo' @getuserinfo="wxLogin" class="third-btn-ico">
					</button>
				<!-- #endif -->
			</view>
			
		</view>
		<!-- #endif -->
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
						} else if(res.data.status == 500){
							uni.showToast({
								title:res.data.msg,
								duration:2000,
								image:"/static/icos/error.png"
							});
						}
					},
					complete: () => {
						uni.hideLoading();
					}
					
				});
			},
			appOAuthLogin(e) {
				// app上第三方登录
			},
			
			// 获取微信信息
			wxLogin(e) {
				var me = this;
				// 获取微信基本信息
				var userInfo = e.detail.userInfo;
				
				// 实现微信登录
				uni.login({
					provider: "weixin",
					success: (loginResult) => {
						// console.log(loginResult);
						// 获得微信登录的code：授权码
						var code = loginResult.code;
						// 设置登录到哪个对于的微信小程序，大家可以根据自己的后端去实现业务参数
						// [0:NEXT超英预告][1:超英预告][2:NEXT学院电影预告]
						var loginToWhichMP = 1;
						uni.request({
							url: me.serverURL + "/mpWXLogin/" + code + "?&qq=843002185",
							data: {
								"avatarUrl": userInfo.avatarUrl,
								"nickName": userInfo.nickName,
								"whichMP": loginToWhichMP,
								"qq":"843002185"
							},
							method: "POST",
							success(userResult) {
								console.log(userResult);
								var userInfo = userResult.data.data;
								// 保存用户信息到全局的缓存中
								uni.setStorageSync("globalUser", userInfo);
								// 切换页面跳转，使用tab切换的api
								uni.switchTab({
									url: "../me/me"
								});
							}
						});
					}
				});
			}
		}
	}
</script>

<style>
	@import url("registLogin.css");
</style>
