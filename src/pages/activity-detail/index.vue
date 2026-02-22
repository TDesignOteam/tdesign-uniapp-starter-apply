<template>
  <NavBar title="详情" :show-back="true" />
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
      />
    </view>

    <!-- 活动嘉宾 -->
    <view v-if="detail && detail.guestImages && detail.guestImages.length" class="detail-section">
      <text class="detail-section__title">活动嘉宾</text>
      <scroll-view scroll-x class="detail-section__scroll">
        <view class="detail-section__images">
          <t-image
            v-for="(img, idx) in detail.guestImages"
            :key="idx"
            :src="img"
            mode="aspectFill"
            custom-style="width: 240rpx; height: 160rpx; border-radius: 8rpx; margin-right: 16rpx; flex-shrink: 0;"
          />
        </view>
      </scroll-view>
    </view>

    <!-- 活动现场 -->
    <view v-if="detail && detail.sceneImages && detail.sceneImages.length" class="detail-section">
      <text class="detail-section__title">活动现场</text>
      <scroll-view scroll-x class="detail-section__scroll">
        <view class="detail-section__images">
          <t-image
            v-for="(img, idx) in detail.sceneImages"
            :key="idx"
            :src="img"
            mode="aspectFill"
            custom-style="width: 240rpx; height: 160rpx; border-radius: 8rpx; margin-right: 16rpx; flex-shrink: 0;"
          />
        </view>
      </scroll-view>
    </view>

    <!-- 活动介绍弹窗 -->
    <view v-if="detail" class="detail-info">
      <text class="detail-info__title">{{ detail.title }}</text>
      <view class="detail-info__meta">
        <view class="detail-info__item">
          <t-icon name="time" size="32rpx" />
          <text>{{ formatDate(detail.date) }}</text>
        </view>
        <view class="detail-info__item">
          <t-icon name="location" size="32rpx" />
          <text>{{ detail.address }}</text>
        </view>
      </view>
      <view class="detail-info__score">
        <t-rate :value="detail.score" size="28rpx" variant="filled" allow-half disabled />
        <text class="detail-info__score-text">{{ detail.score }}分</text>
      </view>
      <text class="detail-info__desc">{{ detail.introduce }}</text>
    </view>
  </view>

  <!-- 底部操作栏 -->
  <view class="detail-footer">
    <view class="detail-footer__actions">
      <view class="detail-footer__action">
        <t-icon name="heart" size="40rpx" />
        <text class="detail-footer__action-text">收藏</text>
      </view>
      <view class="detail-footer__action">
        <t-icon name="share" size="40rpx" />
        <text class="detail-footer__action-text">分享</text>
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
      <t-button v-else theme="primary" size="large" block disabled>
        已下架
      </t-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { onLoad } from '@dcloudio/uni-app';

import type { ActivityDetail } from '@/api/activity';
import { getActivityDetail } from '@/api/activity';
import { formatDate, isExpired } from '@/utils/date';

import NavBar from '@/components/nav-bar.vue';


const activityId = ref('');
const detail = ref<ActivityDetail | null>(null);

const priceText = computed(() => {
  if (!detail.value) return '';
  const min = detail.value.minPrice ?? 0;
  const max = detail.value.maxPrice ?? 0;
  if (min === 0 && max === 0) return '免费';
  if (min === max) return `¥${min}`;
  return `¥${min}-¥${max}`;
});

const isEnded = computed(() => {
  if (!detail.value?.date) return false;
  return isExpired(detail.value.date);
});

/** 获取活动详情 */
async function fetchData() {
  try {
    const data = await getActivityDetail(activityId.value);
    detail.value = data;
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
  background-color: @bg-color;
}

.detail-banner {
  width: 100%;
}

.detail-section {
  padding: 24rpx;

  &__title {
    display: block;
    font-size: @font-size-default;
    font-weight: 600;
    color: @gy1;
    margin-bottom: 16rpx;
  }

  &__scroll {
    white-space: nowrap;
  }

  &__images {
    display: flex;
  }
}

.detail-info {
  padding: 24rpx;
  background-color: @bg-color-white;
  margin: 16rpx;
  border-radius: 16rpx;

  &__title {
    display: block;
    font-size: 36rpx;
    font-weight: 600;
    color: @gy1;
    margin-bottom: 16rpx;
  }

  &__meta {
    margin-bottom: 16rpx;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: @font-size-small;
    color: @gy2;
    margin-bottom: 8rpx;
  }

  &__score {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
  }

  &__score-text {
    margin-left: 8rpx;
    font-size: @font-size-mini;
    color: @gy2;
  }

  &__desc {
    display: block;
    font-size: @font-size-small;
    color: @gy2;
    line-height: 44rpx;
  }
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: @bg-color-white;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);

  &__actions {
    display: flex;
    gap: 32rpx;
    margin-right: 24rpx;
  }

  &__action {
    display: flex;
    flex-direction: column;
    align-items: center;
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
</style>
