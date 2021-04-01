<template>
	<view class="page">
		<view class="player">
			<video id="myTrailer"
			 :src="trailerInfo.trailer" 
			 :poster="trailerInfo.poster" 
			 class="movie" controls></video>
		</view>
		<!-- 基本信息 -->
		<view class="movie-info">
			<navigator :url="'../cover/cover?cover='+trailerInfo.cover">
				<image :src="trailerInfo.cover" mode="aspectFit" class="cover"></image>
			</navigator>
			<view class="movie-desc">
				<view class="title">{{trailerInfo.name}}</view>
				<view class="basic-info">{{trailerInfo.basicInfo}}</view>
				<view class="basic-info">{{trailerInfo.originalName}}</view>
				<view class="basic-info">{{trailerInfo.totalTime}}</view>
				<view class="basic-info">{{trailerInfo.releaseDate}}</view>
				<view class="score-block">
					<view class="big-score">
						<view class="score-words">综合评分</view>
						<view class="movie-score">{{trailerInfo.score}}</view>
					</view>
					<view class="score-stars">
						<!-- 解决 获取不到trailerInfo.score undefined问题 只有有分数时才进入 -->
						<block v-if="trailerInfo.score > 0">
							<trailer-starts :innerScore="trailerInfo.score" showNum="0"></trailer-starts>
						</block>
						<view class="prise-counts">{{trailerInfo.prisedCounts}} 人点赞</view>
					</view>
				</view>

			</view>
		</view>
		<!-- 基本信息 end -->
		<!-- 分割线 -->
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		<!-- 分割线 end -->
		<!-- 剧情介绍 -->
		<view class="plots-block">
			<view class="plots-title">剧情介绍</view>
			<view class="plots-desc">{{trailerInfo.plotDesc}}</view>
		</view>
		<!-- 剧情介绍 end -->

		<!-- 演职人员 -->
		<view class="scroll-block">
			<view class="plots-title">演职人员</view>
			<scroll-view scroll-x class="scroll-list">
				<view class="actor-wapper" v-for="(director, staffIndex) in directorArray">
					<image :src="director.photo" mode="aspectFit" class="single-actor" :data-staffIndex="staffIndex" @click="lookStaffs"></image>
					<view class="actor-name">{{director.name}}</view>
					<view class="actor-role">{{director.actName}}</view>
				</view>
				<view class="actor-wapper" v-for="(actor, actorIndex) in actorArray">
					<image :src="actor.photo" mode="aspectFit" class="single-actor" :data-staffIndex="actorIndex + directorArray.length"
					 @click="lookStaffs"></image>
					<view class="actor-name">{{actor.name}}</view>
					<view class="actor-role">{{actor.actName}}</view>
				</view>
			</scroll-view>
		</view>
		<!-- 演职人员 end -->

		<!-- 剧照 -->

		<view class="scroll-block">
			<view class="plots-title">剧照</view>
			<scroll-view scroll-x class="scroll-list">
				<image v-for="(img, imgIndex) in plotPicsArray" :src="img" mode="aspectFit" class="plot-image" @click="lookme"
				 :data-imageIndex="imgIndex"></image>
			</scroll-view>
		</view>
		<!-- 剧照 end -->
	</view>
</template>

<script>
	import trailerStarts from "../../components/trailerStars.vue"

	export default {
		data() {
			return {
				trailerInfo: {},
				plotPicsArray: [], //剧照
				directorArray: [], //导演列表
				actorArray: [] ,//演员列表
			}
		},
		
		onReady() {
			this.videoContext = uni.createVideoContext('myTrailer');
			
		},
		onHide() {
			//页面被隐藏的时候，暂停播放
			this.videoContext.pause();
		},
		onShow() {
			if (this.videoContext) {
				this.videoContext.play();
			}
		},
		onLoad(params) {
			var me = this;
			var trailerId = params.trailerId;

			uni.showLoading({
				title: '搜索中',
				mask: false
			});
			uni.showNavigationBarLoading();
			uni.request({
				url: me.serverURL + '/search/trailer/' + trailerId + me.serverQQ,
				method: 'POST',
				data: {},
				success: res => {
					if (res.data.status == 200) {
						var trailerInfo = res.data.data;
						me.trailerInfo = trailerInfo;
						// 将剧照的字符串转换成array
						var plotPicsArray = JSON.parse(trailerInfo.plotPics);
						me.plotPicsArray = plotPicsArray;
					}
				},
				fail: () => {},
				complete: () => {
					uni.hideNavigationBarLoading();
					uni.hideLoading();
				}
			});
			// 获取导演 /1
			uni.request({
				url: me.serverURL + '/search/staff/' + trailerId + '/1?' + me.serverQQ,
				method: 'POST',
				data: {},
				success: res => {
					if (res.data.status == 200) {
						var directorArray = res.data.data;
						me.directorArray = directorArray;
					}
				}
			});

			// 获取演员 /2
			uni.request({
				url: me.serverURL + '/search/staff/' + trailerId + '/2?' + me.serverQQ,
				method: 'POST',
				data: {},
				success: res => {
					if (res.data.status == 200) {
						var actorArray = res.data.data;
						me.actorArray = actorArray;
					}
				}
			});
		},

		//监听导航栏的按钮
		onNavigationBarButtonTap: (e) => {
			var me = this;
			var index = e.index;
			console.log("tap button:" + index);
			var trialerInfo = me.trailerInfo;
			var trailderID = trialerInfo.id;
			var trailerName = trialerInfo.name;
			var cover = trailerInfo.cover;
			var poster = trailerInfo.poster;
			var desc = trailerInfo.plotDesc;
			uni.share({
				provider: "weixin",
				scene: "WXSenceTimeline",
				type: 0,
				href: "http://www.imovietrailer.com/#/pages/movie/movie?trailerId=" + trailderID,
				title: trailerName,
				summary: desc,
				imageUrl: cover,
				success: (res) => {
					console.log("分享成功" + res);
				}
			})
		},
		//只支持在小程序端，分享到微信群或者微信好友
		onShareAppMessage: (res) => {
			var me = this;
			return {
				title: me.trailerInfo.name,
				path: '/pages/movie/movie?trailerId=' + me.trailerInfo.id
			};
		},
		methods: {
			// 查看剧照的图片预览
			lookme(e) {
				var me = this;
				var imageindex = e.currentTarget.dataset.imageindex;
				var plotPicsArray = me.plotPicsArray;
				uni.previewImage({
					urls: plotPicsArray,
					// current: imageindex,
					current: plotPicsArray[imageindex]
				});
			},
			// 查看演职表的图片预览
			lookStaffs(e) {
				var me = this;
				var staffIndex = e.currentTarget.dataset.staffindex;
				//拼接导演和演员的数组 成为新数组
				var staffArray = me.directorArray.concat(me.actorArray);

				var urls = [];
				for (var i = 0; i < staffArray.length; i++) {
					var tempPhoto = staffArray[i].photo;
					urls.push(tempPhoto);
				}
				uni.previewImage({
					urls: urls,
					current: urls[staffIndex],
				});
			}
		},
		components: {
			trailerStarts
		}
	}
</script>

<style>
	@import url("movie.css");
</style>
