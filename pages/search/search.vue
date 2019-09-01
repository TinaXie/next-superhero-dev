<template>
	<view class="page">
		<view class="search-block">
			<view class="search-icon-warpper">
				<image src="/static/icos/search.png" class="search-icon"></image>
			</view>
			<input type="text" placeholder="搜索预告" maxlength="10" confirm-type="search" class="search-text" @confirm="searchme" />
		</view>
		<view class="movie-list page-block">
			<view class="movie-wapper" v-for="trailer in trailerList">
				<image :src="trailer.cover"
				 class="poster"
				 :data-trailerID="trailer.id"
				 @click="showTrailer">

				</image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				trailerList: [],
				keywords: "", //搜索关键字
				page: 1, //当前第几页
				totalPages: 1, //总页数
				pageSize:15,
			}
		},
		onLoad() {
			var me = this;
			me.pagedTrailerList(me.keywords, me.page, me.pageSize);
		},
		onReachBottom() {
			var me = this;
			var page = me.page + 1;
			var keywords = me.keywords;
			var totalPages = me.totalPages;
			//如果当前分页大于等于总页数
			if(page > totalPages) {
				console.log("到达最后一页");
				return;
			}
			me.pagedTrailerList(keywords, page, me.pageSize);
		},
		methods: {
			pagedTrailerList(keywords, page, pageSize) {
				var me = this;
				uni.showLoading({
					title: '搜索中',
					mask: false
				});
				uni.showNavigationBarLoading();
				uni.request({
					url: me.serverURL + '/search/list?qq=843002185&page=' + page + '&pageSize=' + pageSize +
						'&keywords=' + keywords,
					method: 'POST',
					data: {},
					success: res => {
						if (res.data.status == 200) {
							var tempList = res.data.data.rows;
							me.trailerList = me.trailerList.concat(tempList);
							me.totalPages = res.data.data.total;
							me.page = page;
						}
					},
					fail: () => {},
					complete: () => {
						uni.hideNavigationBarLoading();
						uni.hideLoading();
					}
				});
			},
			searchme(e) {
				var me = this;
				//获取搜索的内容
				var value = e.detail.value;
				me.keywords = value;
				me.trailerList = [];
				var page = 1;
				me.pagedTrailerList(me.keywords, page, me.pageSize);
			},
			showTrailer(e){
				var me = this;
				var trailerId = e.currentTarget.dataset.trailerid;
				uni.navigateTo({
					url:"../movie/movie?trailerId="+trailerId
				});
			}
		}
	}
</script>

<style>
	@import url("search.css");
</style>
