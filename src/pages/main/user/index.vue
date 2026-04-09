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
            :image="profile?.avatar || 'https://cdn.uwayfly.com/tdesign-uniapp/starter-apply/avatar.jpeg'"
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

      <scroll-view
        style="height: calc(100% - 96rpx);"
        scroll-y
        enhanced
        :bounces="false"
      >
        <ActivityList
          :activities="activities"
          :is-fetching="isFetching"
        />
      </scroll-view>
    </view>
  </view>
  <CustomTabBar />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { getPersonActivities } from '@/api/activity';
import { getUserProfile } from '@/api/user-info';

import ActivityList from '@/components/activity-list.vue';
import CustomTabBar from '@/components/custom-tab-bar.vue';
import NavBar from '@/components/nav-bar.vue';
import { formatDate } from '@/utils/date';

import type { ActivityStatus } from '@/api/activity';
import type { UserProfile } from '@/api/user-info';
import type { ActivityItem } from '@/components/activity-list.vue';


type TabValue = 'first' | 'second' | 'third';

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

onMounted(() => {
  fetchActivities();
  fetchProfile();
});
</script>

<style>
page {
  background: #f3f3f3;
}
</style>
<style lang="less" scoped>
@import "@/styles/variable.less";

.user-page {
  height: calc(100vh - @tab-bar-height - @nav-bar-height - var(--td-navbar-padding-top, 0px) - env(safe-area-inset-bottom));
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
  height: calc(100% - 196rpx);
  margin-top: 16rpx;
  background-color: @bg-color-white;

  :deep(.t-tabs) {
    --td-tab-item-tag-height: 80rpx;
  }
}
</style>
