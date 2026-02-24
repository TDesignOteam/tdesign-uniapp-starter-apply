<template>
  <NavBar title="我的" />
  <view class="user-page">
    <!-- 用户卡片 -->
    <view class="user-card">
      <view class="user-card__info">
        <view class="user-card__avatar">
          <t-skeleton
            v-if="isProfileLoading && !profile"
            :loading="true"
            animation="flashed"
            :row-col="[{ height: '128rpx', width: '128rpx', type: 'circle' }]"
          />
          <t-avatar
            v-else
            :image="profile?.avatar || '/static/avatar.jpeg'"
            size="large"
          />
        </view>
        <view class="user-card__meta">
          <t-skeleton
            v-if="isProfileLoading && !profile"
            :loading="true"
            animation="flashed"
            :row-col="[{ height: '48rpx', width: '96rpx' }]"
          />
          <view v-else>
            <text class="user-card__name">
              {{ profile?.name }}
            </text>
            <view class="user-card__tag">
              <t-tag variant="light">
                {{ profile?.age }}岁
              </t-tag>
              <t-tag variant="light">
                {{ profile?.occupation }}
              </t-tag>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 活动列表 -->
    <view class="activity-section">
      <t-tabs
        :value="tabValue"
        @change="onTabChange"
      >
        <t-tab-panel
          value="first"
          label="待参加"
        />
        <t-tab-panel
          value="second"
          label="已完成"
        />
        <t-tab-panel
          value="third"
          label="全部活动"
        />
      </t-tabs>

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
                  :style="{ color: item.status === '已完成' ? '#00000066' : '#2ba471' }"
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
    </view>
  </view>
  <CustomTabBar />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { getPersonActivities } from '@/api/activity';
import { getUserProfile } from '@/api/user-info';

import ActivityCardSkeleton from '@/components/activity-card-skeleton.vue';
import ActivityCard from '@/components/activity-card.vue';
import CustomTabBar from '@/components/custom-tab-bar.vue';
import NavBar from '@/components/nav-bar.vue';
import { formatDate } from '@/utils/date';

import type { ActivityStatus } from '@/api/activity';
import type { UserProfile } from '@/api/user-info';


type TabValue = 'first' | 'second' | 'third';

interface ActivityItem {
  id: string;
  cover: string;
  title: string;
  time: string;
  status: ActivityStatus;
}

const tabValue = ref<TabValue>('first');
const activities = ref<ActivityItem[]>([]);
const isFetching = ref(false);
const profile = ref<UserProfile | null>(null);
const isProfileLoading = ref(false);

/** 将 Tab 值映射为活动状态 */
function mapTabToStatus(tab: TabValue): ActivityStatus | undefined {
  if (tab === 'first') return '待参加';
  if (tab === 'second') return '已完成';
  return undefined;
}

/** 获取活动列表 */
async function fetchActivities() {
  isFetching.value = true;
  try {
    const status = mapTabToStatus(tabValue.value);
    const response = await getPersonActivities({
      page: 1,
      pageSize: 20,
      status,
    });

    const pageData = Array.isArray(response.data) ? response.data : [];
    activities.value = pageData.map(item => ({
      id: String(item.id),
      cover: item.cover,
      title: item.title,
      time: formatDate(item.date),
      status: item.status,
    }));
  } catch (error) {
    activities.value = [];
    console.error('获取活动列表失败:', error);
  } finally {
    isFetching.value = false;
  }
}

/** 获取用户资料 */
async function fetchProfile() {
  isProfileLoading.value = true;
  try {
    const response = await getUserProfile();
    profile.value = response.data;
  } catch (error) {
    console.error('获取用户资料失败:', error);
  } finally {
    isProfileLoading.value = false;
  }
}

/** Tab 切换 */
function onTabChange({ value }: { value: number | string }) {
  tabValue.value = String(value) as TabValue;
  fetchActivities();
}

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

onMounted(() => {
  fetchActivities();
  fetchProfile();
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.user-page {
  min-height: calc(100vh - @tab-bar-height);
  background-color: @bg-color;
}

.user-card {
  padding: 32rpx;
  background-color: @bg-color-white;

  &__info {
    display: flex;
    align-items: center;
  }

  &__meta {
    margin-left: 24rpx;
  }

  &__name {
    font-size: 36rpx;
    font-weight: 600;
    color: @gy1;
  }

  &__tag {
    display: flex;
    gap: 16rpx;
    margin-top: 12rpx;
  }
}

.activity-section {
  margin-top: 16rpx;
  background-color: @bg-color-white;

  :deep(.t-tabs) {
    --td-tab-item-tag-height: 80rpx;
  }
}

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
