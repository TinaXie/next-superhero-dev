<template>
	<view class="page">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :indicator-active-color="indicatoractivecolor" class="carousel">
			<swiper-item v-for="carousel in carouselList">
				<navigator open-type="navigate" :url="'../movie/movie?trailerId=' + carousel.movieId">
					<image :src="carousel.image"
					 class="carousel"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 热门超英 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="/static/icos/hot.png" class="hot-icon"></image>
				<view class="hot-title">
					热门超英
				</view>
			</view>
		</view>
		<!-- 滚动 -->
		<scroll-view scroll-x="true" class="page-block hot">
			<view class="single-poster" v-for="superHero in hotSuperHeroList">
				<view class="poster-wapper">
					<navigator open-type="navigate" :url="'../movie/movie?trailerId=' + superHero.id">
						<image :src="superHero.cover" class="poster"></image>
					</navigator>
					<view class="movie-name">{{superHero.name}}</view>
					<trailer-starts :innerScore="superHero.score" showNum="1"></trailer-starts>
				</view>
			</view>
		</scroll-view>
		<!-- 热门预告 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="/static/icos/interest.png" class="hot-icon"></image>
				<view class="hot-title">
					热门预告
				</view>
			</view>
		</view>
		<view class="hot-movies page-block">
			<video v-for="trailer in hotTrailerList" :src="trailer.trailer" :poster="trailer.poster" class="hot-movie-single"
			 controls></video>
		</view>
		<!-- 猜你喜欢 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="/static/icos/guess-u-like.png" class="hot-icon"></image>
				<view class="hot-title">
					猜你喜欢
				</view>
			</view>
		</view>
		<view class="page-block guess-u-like">
			<view class="single-like-movie" v-for="(guess, gIndex) in guessULikeList">
				<navigator open-type="navigate" :url="'../movie/movie?trailerId=' + guess.id">
					<image :src="guess.cover" class="like-movie"></image>
				</navigator>
				<view class="movie-desc">
					<view class="movie-title">
						{{guess.name}}
					</view>
					<trailer-starts :innerScore="9.1" showNum="0"></trailer-starts>
					<view class="movie-info">
						{{guess.basicInfo}}
					</view>
					<view class="movie-info">
						{{guess.releaseDate}}
					</view>
				</view>
				<view class="mover-oper" :data-gIndex ="gIndex"  @click="pariseMe">
					<image src="/static/icos/praise.png" class="praise-icon"></image>
					<view class="praise-me">
						点赞
					</view>
					<view :animation="animationDataArr[gIndex]" class="praise-me animation-opacity">
						+1
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 导入自定义组件
	import trailerStarts from "../../components/trailerStars.vue"

	// #ifdef APP-PLUS || MP-WEIXIN
	//在页面创建的时候 创建一个临时动画对象
	var animation = uni.createAnimation();
	// #endif

	export default {
		data() {
			return {
				carouselList: [],
				hotSuperHeroList: [],
				hotTrailerList: [],
				guessULikeList:[],
				animationData: {},
				
				animationDataArr:[{}, {}, {}, {}, {}],
				indicatoractivecolor: "rgb(255, 255, 255, 0.5)"
			}
		},

		onLoad() {
			var me = this;
			//请求轮播图数据
			uni.request({
				url: me.serverURL + '/index/carousel/list?&qq=843002185',
				method: "POST",
				success: (res) => {
					if (res.data.status == 200) {
						var carouselList = res.data.data;
						me.carouselList = carouselList;
					}
				}
			});

			//请求热门超英
			uni.request({
				url: me.serverURL + '/index/movie/hot?&qq=843002185&type=superhero',
				method: "POST",
				success: (res) => {
					if (res.data.status == 200) {
						me.hotSuperHeroList = res.data.data;
					}
				}
			});
			//请求热门预告
			uni.request({
				url: me.serverURL + '/index/movie/hot?&qq=843002185&type=superhero',
				method: "POST",
				success: (res) => {
					if (res.data.status == 200) {
						me.hotTrailerList = res.data.data;
					}
				}
			});			
			me.refresh();
		},
		onUnload() {
			//页面卸载的时候 清除数据
			me.animationData = {};
			me.animationDataArr = [{}, {}, {}, {}, {}];
		},
		
		//下拉刷新
		onPullDownRefresh() {
			me.refresh();
		},
		onShow() {

		},
		methods: {
			refresh(){
				var me = this;
				//页面显示加载
				uni.showLoading({
					mask:true,//是否屏蔽页面点击
				});
				
				//navigationbar 显示加载
				uni.showNavigationBarLoading();
				
				//请求猜你喜欢
				console.log("refresh 2");
				uni.request({
					url:me.serverURL + '/index/guessULike?qq=843002185',
					method:"POST",
					success: (res) => {
						if (res.data.status == 200) {
							me.guessULikeList = res.data.data;
						}
					},
					complete() {
						//隐藏刷新
						uni.hideNavigationBarLoading();
						uni.hideLoading();
						//加载完成后结束下拉刷新
						uni.stopPullDownRefresh();
					}
				})
			},
			pariseMe(e) {
				var me = this;
				// #ifdef APP-PLUS || MP-WEIXIN
				var gIndex = e.currentTarget.dataset.gindex;
				
				//构建动画数据，并通过step来表示这组动画的完成
				animation.translateY(-60).opacity(1).step({
					duration: 400
				});
				me.animationData = animation;
				me.animationDataArr[gIndex] = animation.export();
				setTimeout(function() {
					animation.translateY(0).opacity(0).step({
						duration: 0
					});
					me.animationData = animation;
					me.animationDataArr[gIndex] = animation.export();
				}.bind(me), 600); // 5秒
				// #endif
				
			}
		},
		components: {
			trailerStarts
		}
	}
</script>
<style>
	@import url("index.css");
</style>
