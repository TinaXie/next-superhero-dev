<template>
	<view class="page page-fill">
		<view class="pending-wapper">
			<image id="face" :src="tempFace" class="pending-face" mode="scaleToFill"></image>
		</view>
		
		<view class="notice">
			<view class="notice-words">
				* 请从相册中选择等比宽高的图片噢～
			</view>
		</view>
		
		<view class="footer-opertor">
			<view class="opertor-words" @click="changePedingFace">
				重新上传
			</view>
			<view class="opertor-words" @click="uploadFace">
				确定上传
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tempFace:""
			}
		},
		onLoad(params) {
			var me = this;
			var tempFace = params.tempFilePath;
			me.tempFace = tempFace;
		},
		methods: {
			changePedingFace(){
				var me = this;
				//从相册选择上传
				uni.chooseImage({
					count:1,
					sizeType:["compressed"],
					sourceType:["album"],
					success: (res) => {
						// 获得临时路径
						var tempFilePath = res.tempFilePaths[0];
						me.tempFace = tempFilePath;
					}
				});
			},
			uploadFace(){
				var me = this;
				var globalUser = me.getGlobalUser();
				uni.showLoading({
					mask:true,
					title:"上传中, 请稍后"
				});
				
				console.log("===111====" + me.tempFace);
				uni.uploadFile({
					url:me.serverURL+"/user/uploadFace?userId=" + globalUser.id + "&qq=843002185",
					filePath:me.tempFace,
					name:"file",
					header:{
						"headerUserId": globalUser.id,
						"headerUserToken": globalUser.userUniqueToken
					},
					success: (resp) => {
						var resDataStr =resp.data;
						// 解析数据结构
						var resData = JSON.parse(resDataStr);
						
						if (resData.status == 200) {
							//获取最新的用户数据
							var userInfo = resData.data;
							uni.setStorageSync("globalUser", userInfo);
							uni.navigateBack({
								delta:1
							});
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
			}
		}
	}
</script>

<style>
	@import url("meface.css");
</style>
