<template>
  <view class="activity-list">
    <ActivityCardSkeleton
      v-if="isFetching && activities.length === 0"
      :count="2"
    />
    <t-empty
      v-if="!isFetching && activities.length === 0"
      description="暂无活动"
    />
    <view
      v-for="item in activities"
      :key="item.id"
      class="activity-item"
    >
      <ActivityCard
        :cover="item.cover"
        :title="item.title"
        @click="goDetail(item.id)"
      >
        <template #content>
          <text class="activity-item__time">
            {{ item.time }}
          </text>
        </template>
        <template #footer>
          <view class="activity-item__footer">
            <text
              class="activity-item__status"
              :style="{ color: item.status === '已完成' ? 'var(--td-text-color-placeholder, #00000066)' : '#2ba471' }"
            >
              {{ item.status }}
            </text>
            <t-button
              v-if="item.status === '已完成'"
              size="extra-small"
              theme="primary"
              variant="text"
              custom-style="margin-right: unset;"
              @click.stop="onReview(item.id)"
            >
              去评价
            </t-button>
          </view>
        </template>
      </ActivityCard>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ActivityStatus } from '@/api/activity';

import ActivityCardSkeleton from '@/components/activity-card-skeleton.vue';
import ActivityCard from '@/components/activity-card.vue';


export interface ActivityItem {
  id: string;
  cover: string;
  title: string;
  time: string;
  status: ActivityStatus;
}

defineProps<{
  /** 活动列表数据 */
  activities: ActivityItem[];
  /** 是否正在加载 */
  isFetching: boolean;
}>();

/** 跳转活动详情 */
function goDetail(id: string) {
  uni.navigateTo({
    url: `/pages/activity-detail/index?id=${id}`,
  });
}

/** 评价 */
function onReview(id: string) {
  console.log('评价活动:', id);
}
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.activity-list {
  padding: 24rpx;
  background-color: @bg-color;
}

.activity-item {
  &__time {
    font-size: @font-size-mini;
    color: @gy2;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__status {
    font-size: @font-size-small;
    font-weight: 500;
  }
}
</style>
