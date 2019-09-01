<template>
	<view class="page">
		<view class="search-block">
			<view class="search-icon-warpper">
				<image src="/static/icos/search.png" class="search-icon"></image>
			</view>
			<input type="text" placeholder="搜索预告" maxlength="10" class="search-text" />
		</view>
		<view class="movie-list page-block">
			<view class="movie-wapper"  v-for="i in 20">
				<image src="http://122.152.205.72:88/group1/M00/00/03/CpoxxFw1ZHiASu_7AAfGb_KNy8Y861.png" class="poster">
					
				</image>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				trailerList:[]
			}
		},
		onLoad() {
			uni.showLoading({
				title: '搜索中',
				mask: false
			});
			uni.showNavigationBarLoading();
			uni.request({
				url: this.serverURL + '/search/list?qq=843002185&page=&pageSize=&keywords=',
				method: 'POST',
				data: {
				},
				success: res => {
					if (res.data.status == 200) {
						this.trailerList = res.data.data.rows;
					}
				},
				fail: () => {},
				complete: () => {
					uni.hideNavigationBarLoading();
					uni.hideLoading();
				}
			});
		},
		methods: {
			
		}
	}
</script>

<style>
	@import url("search.css");

</style>
