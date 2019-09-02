<template>
	<view class="black">
		<image :src="cover" mode="widthFix" class="cover" @longpress="longPress"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cover: "",
			}
		},
		onLoad(params) {
			var me = this;
			var cover = params.cover;
			me.cover = cover;
		},
		methods: {
			longPress() {
				var me = this;
				uni.showActionSheet({
					itemList: ["保存图片"],
					success: (res) => {
						console.log("图片:" + me.cover);
						
						var tapIndex = res.tapIndex;
						if (tapIndex == 0) {
							//下载图片
							console.log("进入保存图片");
							uni.showLoading({
								title: "图片保存中..."
							});
							uni.downloadFile({
								url: me.cover,
								success: (result) => {
									var tempFilePath = result.tempFilePath;
									uni.saveImageToPhotosAlbum({
										filePath:tempFilePath,
										success: () => {
											uni.showToast({
												title:"保存成功",
												duration:2000
											});
										},
										complete() {
											uni.hideLoading();
										}
									});
								},
								fail: () => {
									uni.hideLoading();
								}
							});
						}
					}
				});
			}
		}

	}
</script>

<style>
	@import url("cover.css");
</style>
