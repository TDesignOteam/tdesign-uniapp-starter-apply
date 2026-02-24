<template>
  <NavBar
title="购买结果"
          :show-back="true"
/>
  <view class="result-page">
    <!-- 成功状态 -->
    <view class="result-status">
      <t-result
theme="success"
                title="购买成功"
/>
    </view>

    <!-- 活动信息卡片 -->
    <view class="activity-card">
      <t-image
        :src="activity.cover"
        mode="aspectFill"
        custom-style="width: 100%; height: 240rpx; border-radius: 16rpx;"
      />
      <text class="activity-card__name">
        {{ activity.name }}
      </text>
      <view class="activity-card__details">
        <view class="activity-card__item">
          <t-icon
name="time"
                  size="32rpx"
/>
          <text>{{ activity.date }}</text>
        </view>
        <view class="activity-card__item">
          <t-icon
name="location"
                  size="32rpx"
/>
          <text>{{ activity.address }}</text>
        </view>
      </view>
    </view>

    <!-- 报名人员 -->
    <text class="section-title">
      报名人员
    </text>
    <view class="person-info">
      <t-avatar image="/static/avatar.jpeg" />
      <view class="person-info__details">
        <text class="person-info__name">
          {{ selectedPerson.name }}
        </text>
        <text class="person-info__desc">
          {{ selectedPerson.age }} {{ selectedPerson.occupation }}
        </text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <t-button
        theme="light"
        variant="outline"
        block
        size="large"
        icon="share"
        @click="shareWithFriends"
      >
        分享给朋友
      </t-button>
      <t-button
        theme="primary"
        block
        size="large"
        @click="goToView"
      >
        去查看
      </t-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

import { onLoad } from '@dcloudio/uni-app';

import { getActivityDetail } from '@/api/activity';
import NavBar from '@/components/nav-bar.vue';
import { formatDate } from '@/utils/date';


const activityId = ref('');

const activity = reactive({
  name: '',
  date: '',
  address: '',
  cover: '',
});

const selectedPerson = reactive({
  name: '蔡宣轩',
  age: '29岁',
  occupation: '设计师/艺术从业者',
});

/** 获取活动信息 */
async function fetchActivityData() {
  try {
    const { data } = await getActivityDetail(activityId.value);
    activity.name = data.title;
    activity.date = formatDate(data.date);
    activity.address = data.address;
    activity.cover = data.cover;
  } catch (err) {
    console.error('获取活动数据失败:', err);
  }
}

/** 分享给朋友 */
function shareWithFriends() {
  uni.showToast({ title: '分享功能待实现', icon: 'none' });
}

/** 去查看 */
function goToView() {
  uni.navigateTo({
    url: `/pages/activity-detail/index?id=${activityId.value}`,
  });
}

onLoad((options) => {
  activityId.value = options?.id || '';
  if (activityId.value) {
    fetchActivityData();
  }
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.result-page {
  padding: 24rpx;
  background-color: @bg-color;
  min-height: 100vh;
}

.result-status {
  padding: 48rpx 0;
}

.activity-card {
  padding: 24rpx;
  background-color: @bg-color-white;
  border-radius: 16rpx;
  margin-bottom: 32rpx;

  &__name {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    color: @gy1;
    margin-top: 16rpx;
  }

  &__details {
    margin-top: 12rpx;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: @font-size-small;
    color: @gy2;
    margin-bottom: 8rpx;
  }
}

.section-title {
  display: block;
  font-size: @font-size-default;
  font-weight: 600;
  color: @gy1;
  margin-bottom: 16rpx;
}

.person-info {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: @bg-color-white;
  border-radius: 16rpx;
  margin-bottom: 48rpx;

  &__details {
    margin-left: 24rpx;
  }

  &__name {
    display: block;
    font-size: @font-size-default;
    font-weight: 500;
    color: @gy1;
  }

  &__desc {
    display: block;
    font-size: @font-size-mini;
    color: @gy2;
    margin-top: 4rpx;
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
