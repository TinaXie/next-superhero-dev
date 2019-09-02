<template name="trailerStars">
	<view class="movie-score-wapper">
		<image v-for="yellow in yellowScore" src="/static/icos/star-yellow.png" class="star-ico"></image>
		<image v-for="gray in grayScore" src="/static/icos/star-gray.png" class="star-ico"></image>
		<view class="movie-score" v-if="showNum == 1">
			{{innerScore}}
		</view>

	</view>
</template>

<script>
	export default {
		name: "trailerStars",
		data() {
			return {
				yellowScore: 0,
				grayScore: 5
			};
		},
		props: {
			//定义外部传入的分数
			innerScore: 0,
			//是否需要显示具体的分数值
			showNum: 0
		},
		//生命周期 组件创建完成后调用
		created() {
			var tempScore = 0;
			if (this.innerScore != null && this.innerScore != undefined &&
				this.innerScore != "") {
				tempScore = this.innerScore;
			}
			tempScore = Math.min(10, tempScore);
			tempScore = Math.max(0, tempScore);

			var yellowScore = parseInt(tempScore / 2);
			var grayScore = 5 - yellowScore;
			this.yellowScore = yellowScore;
			this.grayScore = grayScore;
		}
	}
</script>

<style>
	.movie-score-wapper {
		display: flex;
		flex-direction: row;
	}

	.star-ico {
		width: 20upx;
		height: 20upx;
		margin-top: 6upx;
	}

	.movie-score {
		font-size: 12px;
		color: gray;
		margin-left: 8upx;
	}
</style>
