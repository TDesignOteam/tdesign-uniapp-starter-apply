<template>
  <NavBar
    title="详情"
    :show-back="true"
  />
  <view class="detail-page">
    <!-- 横幅图 -->
    <view class="detail-banner">
      <t-skeleton
        v-if="!detail"
        :loading="true"
        :row-col="[{ width: '100%', height: '320rpx' }]"
      />
      <t-image
        v-else
        :src="detail.banner || detail.cover"
        mode="aspectFill"
        custom-style="width: 100%; height: 320rpx;"
        class="detail-banner__image"
      />
    </view>

    <!-- 活动嘉宾 -->
    <view
      v-if="detail && guestImages.length > 0"
      class="detail-section detail-section--animated"
    >
      <text class="detail-section__title">
        活动嘉宾
      </text>
      <view class="detail-section__swiper">
        <ActivitySwiper
          :list="guestSwiperList"
          :autoplay="false"
          :navigation="{ type: 'dots' }"
          margin-position="right"
          height="320rpx"
        />
      </view>
    </view>

    <!-- 活动现场 -->
    <view
      v-if="detail && sceneImages.length > 0"
      class="detail-section detail-section--animated"
      style="animation-delay: 0.15s"
    >
      <text class="detail-section__title">
        活动现场
      </text>
      <view class="detail-section__swiper">
        <ActivitySwiper
          :list="sceneSwiperList"
          :autoplay="false"
          :navigation="{ type: 'dots' }"
          margin-position="right"
          height="320rpx"
        />
      </view>
    </view>
  </view>

  <!-- 底部操作栏 -->
  <view class="detail-footer">
    <view class="detail-footer__actions">
      <view class="detail-footer__action">
        <t-icon
          name="heart"
          size="40rpx"
        />
        <text class="detail-footer__action-text">
          收藏
        </text>
      </view>
      <view class="detail-footer__action">
        <t-icon
          name="share"
          size="40rpx"
        />
        <text class="detail-footer__action-text">
          分享
        </text>
      </view>
    </view>
    <view class="detail-footer__cta">
      <t-button
        v-if="!isEnded"
        theme="primary"
        size="large"
        block
        @click="handleBuy"
      >
        立即购买 {{ priceText }}
      </t-button>
      <t-button
        v-else
        theme="primary"
        size="large"
        block
        disabled
      >
        已下架
      </t-button>
    </view>
  </view>

  <!-- 底部弹层：活动信息详情 -->
  <DetailPopup
    :detail="detail"
    :show-bottom-popup="showBottomPopup"
    :popup-height="popupHeight"
    @toggle="controlPopup"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { onLoad } from '@dcloudio/uni-app';

import { getActivityDetail } from '@/api/activity';
import ActivitySwiper from '@/components/activity-swiper.vue';
import NavBar from '@/components/nav-bar.vue';
import { isExpired } from '@/utils/date';


import DetailPopup from './components/detail-popup.vue';

import type { ActivityDetail } from '@/api/activity';
import type { SwiperItem } from '@/components/activity-swiper.vue';


const activityId = ref('');
const detail = ref<ActivityDetail | null>(null);

/** 底部弹层展开状态 */
const showBottomPopup = ref(true);

/** 弹层高度 */
const popupHeight = computed(() => (showBottomPopup.value ? '80vh' : '182rpx'));

/** 嘉宾图片列表 */
const guestImages = computed<string[]>(() => detail.value?.guestImages ?? []);

/** 现场图片列表 */
const sceneImages = computed<string[]>(() => detail.value?.sceneImages ?? []);

/** 构造嘉宾轮播组件数据格式 */
const guestSwiperList = computed<SwiperItem[]>(() => guestImages.value.map((url, index) => ({
  id: String(index),
  name: `活动嘉宾图片${index + 1}`,
  url,
})));

/** 构造现场轮播组件数据格式 */
const sceneSwiperList = computed<SwiperItem[]>(() => sceneImages.value.map((url, index) => ({
  id: String(index),
  name: `活动现场图片${index + 1}`,
  url,
})));

/** 价格文案 */
const priceText = computed(() => {
  if (!detail.value) return '';
  const min = detail.value.minPrice ?? 0;
  const max = detail.value.maxPrice ?? 0;
  if (min === 0 && max === 0) return '免费';
  if (min === max) return `¥${min}`;
  return `¥${min}-¥${max}`;
});

/** 活动是否已结束 */
const isEnded = computed(() => {
  if (!detail.value?.date) return false;
  return isExpired(detail.value.date);
});

/** 切换底部弹层 */
function controlPopup() {
  showBottomPopup.value = !showBottomPopup.value;
}

/** 获取活动详情 */
async function fetchData() {
  try {
    const data = await getActivityDetail(activityId.value);
    detail.value = data.data;
  } catch {
    uni.showToast({ title: '活动不存在', icon: 'none' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  }
}

/** 购买 */
function handleBuy() {
  if (isEnded.value) return;
  uni.navigateTo({
    url: `/pages/buy-confirm/index?id=${activityId.value}`,
  });
}

onLoad((options) => {
  activityId.value = options?.id || '';
  if (activityId.value) {
    fetchData();
  }
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.detail-page {
  padding-bottom: 160rpx;
  background-color: #1a1a2e;
  min-height: 100vh;
}

/* 横幅图 */
.detail-banner {
  width: 100%;
  margin-bottom: 24rpx;

  &__image {
    opacity: 0;
    animation: fadeIn 0.4s ease forwards;
  }
}

/* 图片渐显动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* 区域渐入动画 */
@keyframes sectionFadeIn {
  from {
    opacity: 0;
    transform: translateY(16rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* 分区 */
.detail-section {
  color: #fff;
  margin-left: 32rpx;
  margin-bottom: 32rpx;

  &__title {
    display: block;
    font-size: @font-size-default;
    font-weight: 600;
    text-align: left;
    margin-bottom: 16rpx;
  }

  &__swiper {
    overflow: hidden;
    margin-top: 8rpx;
    position: relative;
  }

  /* 渐入动画修饰类 */
  &--animated {
    opacity: 0;
    animation: sectionFadeIn 0.3s ease forwards;
  }
}

/* 底部操作栏 */
.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 12000;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: @bg-color-white;
  // box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);
  gap: 24rpx;
  height: --footer-height;

  &__actions {
    display: flex;
    gap: 32rpx;
  }

  &__action {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80rpx;
  }

  &__action-text {
    font-size: @font-size-mini;
    color: @gy2;
    margin-top: 4rpx;
  }

  &__cta {
    flex: 1;
  }
}

/* 覆盖 t-swiper 默认定位，让导航指示器居中 */
:deep(.t-swiper) {
  position: unset;
}
</style>
