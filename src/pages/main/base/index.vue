<template>
  <NavBar show-location />
  <view class="home-container">
    <view class="home-content">
      <!-- 搜索框 -->
      <view class="search-wrap">
        <t-search
          v-model="searchValue"
          shape="round"
          placeholder="搜索活动"
          :clearable="true"
        />
      </view>

      <!-- 热门推荐 -->
      <view class="section">
        <text class="section__title">热门推荐</text>
        <t-swiper
          v-if="swiperList.length > 0"
          :list="swiperList"
          :navigation="{ type: 'dots-bar' }"
          height="300rpx"
        />
      </view>

      <!-- 全部活动 -->
      <view class="section">
        <text class="section__title">全部活动</text>
        <view class="tab-wrap">
          <t-tabs
            v-model:value="currentTab"
            :split="false"
            :show-bottom-line="false"
            @change="onTabChange"
          >
            <t-tab-panel value="latest" label="最新活动" />
            <t-tab-panel value="top" label="高分活动" />
          </t-tabs>
        </view>
      </view>

      <t-divider custom-style="margin: 0" />

      <!-- 活动列表 -->
      <view v-if="!isFetching && activityList.length === 0" class="empty-wrap">
        <t-empty description="暂无相关活动" />
      </view>

      <view v-else-if="isFetching && activityList.length === 0">
        <ActivityCardSkeleton />
      </view>

      <view v-else class="activity-list">
        <ActivityCard
          v-for="item in activityList"
          :key="item.id"
          :cover="item.cover"
          :title="item.title"
          @click="goDetail(item.id)"
        >
          <template #content>
            <view class="rate-wrap">
              <t-rate
                :value="item.score"
                size="28rpx"
                variant="filled"
                allow-half
                disabled
              />
              <text class="rate-text">{{ item.score }}分</text>
            </view>
          </template>
          <template #footer>
            <text class="price">{{ item.formattedPrice }}</text>
          </template>
        </ActivityCard>
      </view>
    </view>
  </view>
  <CustomTabBar />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import request from '@/api/request';
import { formatPrice } from '@/utils/formatters';

import ActivityCard from '@/components/activity-card.vue';
import ActivityCardSkeleton from '@/components/activity-card-skeleton.vue';
import CustomTabBar from '@/components/custom-tab-bar.vue';
import NavBar from '@/components/nav-bar.vue';


interface ActivityItem {
  id: string;
  title: string;
  cover: string;
  score: number;
  formattedPrice: string;
}

const searchValue = ref('');
const currentTab = ref('latest');
const swiperList = ref<string[]>([]);
const activityList = ref<ActivityItem[]>([]);
const isFetching = ref(true);

/** 获取首页数据 */
const fetchData = async () => {
  isFetching.value = true;
  try {
    const [swiperRes, activityRes] = await Promise.all([
      request('/homeSwiper'),
      request('/activities', 'POST', { params: { sort: currentTab.value, page: 1, pageSize: 10 } }),
    ]);

    swiperList.value = swiperRes.data.map((item: { image: string }) => item.image);
    activityList.value = activityRes.data.paginatedData.map((item: any) => ({
      ...item,
      formattedPrice: formatPrice(item.minPrice, item.maxPrice),
    }));
  } catch (err) {
    console.error('获取首页数据失败:', err);
  } finally {
    isFetching.value = false;
  }
};

/** Tab 切换 */
const onTabChange = () => {
  fetchData();
};

/** 跳转活动详情 */
const goDetail = (id: string) => {
  uni.navigateTo({
    url: `/pages/activity-detail/index?id=${id}`,
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.home-container {
  height: calc(100vh - @tab-bar-height);

  .home-content {
    height: calc(100% - @nav-bar-height);
    overflow: auto;
    background-color: @bg-color;
  }
}

.search-wrap {
  padding: 0 24rpx;
  background-color: @bg-color-white;
}

.section {
  padding: 24rpx;

  &__title {
    display: block;
    font-size: @headline-medium;
    font-weight: 600;
    margin-bottom: 16rpx;
    color: @gy1;
  }
}

.tab-wrap {
  :deep(.t-tabs) {
    --td-tab-item-tag-height: 72rpx;
    --td-tab-font-size: @font-size-small;
  }
}

.empty-wrap {
  padding: 120rpx 0;
}

.activity-list {
  padding: 24rpx;
}

.rate-wrap {
  display: flex;
  align-items: center;
}

.rate-text {
  margin-left: 8rpx;
  font-size: @font-size-mini;
  color: @gy2;
}

.price {
  font-size: @font-size-default;
  font-weight: 600;
  color: #e34d59;
}
</style>
