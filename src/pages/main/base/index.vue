<template>
  <view>
    <NavBar show-location />
    <view
      class="home-container"
    >
      <view class="home-content">
        <scroll-view
          scroll-y
          :bounces="false"
          :show-scrollbar="false"
          style="height: 100%;"
        >
          <!-- 搜索框 -->
          <view class="search-wrap">
            <t-search
              v-model:value="searchValue"
              shape="round"
              placeholder="搜索活动"
              :clearable="true"
            />
          </view>

          <!-- 热门推荐 -->
          <view class="section">
            <text class="section__title">
              热门推荐
            </text>
            <ActivitySwiper
              :list="swiperList"
              :loading="isFetchingSwiper"
              :navigation="{ type: 'dots-bar' }"
              height="300rpx"
            />
          </view>

          <!-- 全部活动 -->
          <view class="section">
            <text class="section__title">
              全部活动
            </text>
            <view class="tab-wrap">
              <view class="tab-wrap__tabs">
                <t-tabs
                  v-model:value="currentTab"
                  :split="false"
                  :show-bottom-line="false"
                  @change="onTabChange"
                >
                  <t-tab-panel
                    value="latest"
                    label="最新活动"
                  />
                  <t-tab-panel
                    value="top"
                    label="高分活动"
                  />
                </t-tabs>
              </view>
              <view
                class="tab-wrap__filter"
                @click="filterPopupVisible = true"
              >
                <t-icon
                  name="filter"
                  size="32rpx"
                />
                <text class="tab-wrap__filter-text">
                  筛选
                </text>
              </view>
            </view>
          </view>

          <t-divider custom-style="margin: 0" />

          <!-- 活动列表 -->
          <view
            v-if="!isFetching && activityList.length === 0"
            class="empty-wrap"
          >
            <t-empty description="暂无相关活动" />
            <text class="empty-wrap__hint">
              换个筛选条件试试，或许有惊喜哦～
            </text>
          </view>

          <view v-else-if="isFetching && activityList.length === 0">
            <ActivityCardSkeleton />
          </view>

          <view
            v-else
            class="activity-list"
          >
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
                  <text class="rate-text">
                    {{ item.score }}分
                  </text>
                </view>
              </template>
              <template #footer>
                <text class="price">
                  {{ item.formattedPrice }}
                </text>
              </template>
            </ActivityCard>
          </view>
        </scroll-view>
      </view>
    </view>
    <CustomTabBar />

    <!-- 筛选弹窗 -->
    <ActivityFilterPopup
      v-model:visible="filterPopupVisible"
      :filters="filters"
      @reset="resetAndFetch"
      @update:filters="handleFiltersUpdate"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

import type { ActivityFilterParams } from '@/api/activity';

import type { SwiperItem } from '@/components/activity-swiper.vue';

import request from '@/api/request';

import ActivityCardSkeleton from '@/components/activity-card-skeleton.vue';
import ActivityCard from '@/components/activity-card.vue';
import ActivityFilterPopup from '@/components/activity-filter-popup.vue';
import ActivitySwiper from '@/components/activity-swiper.vue';
import CustomTabBar from '@/components/custom-tab-bar.vue';
import NavBar from '@/components/nav-bar.vue';
import { defaultFilterOptions } from '@/constant/filters';
import { formatPrice } from '@/utils/formatters';


interface ActivityItem {
  id: string;
  title: string;
  cover: string;
  score: number;
  formattedPrice: string;
}

const searchValue = ref('');
const currentTab = ref('latest');
const swiperList = ref<SwiperItem[]>([]);
const activityList = ref<ActivityItem[]>([]);
const isFetchingSwiper = ref(true);
const isFetching = ref(true);
const filterPopupVisible = ref(false);

// 筛选器状态
const filters = reactive<ActivityFilterParams>({
  domain: [],
  type: [],
  minPrice: defaultFilterOptions.minPrice,
  maxPrice: defaultFilterOptions.maxPrice,
  dateRange: Array.from(defaultFilterOptions.dateRange).map((d: Date) => new Date(d)),
});

/** 获取首页数据 */
const fetchData = async () => {
  isFetching.value = true;
  try {
    const [swiperRes, activityRes] = await Promise.all([
      request('/homeSwiper'),
      request('/activities', 'POST', {
        params: {
          sort: currentTab.value,
          page: 1,
          pageSize: 10,
          domain: Array.from(filters.domain),
          type: Array.from(filters.type),
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          dateRange: Array.from(filters.dateRange),
        },
      }),
    ]);

    const swiperData = swiperRes?.data || [];
    swiperList.value = Array.isArray(swiperData) ? swiperData : [];
    isFetchingSwiper.value = false;

    const paginatedData = activityRes?.data?.paginatedData || [];
    activityList.value = (Array.isArray(paginatedData) ? paginatedData : []).map((item: any) => ({
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

/** 处理筛选器更新 */
const handleFiltersUpdate = (newFilters: ActivityFilterParams) => {
  Object.assign(filters, newFilters);
  fetchData();
};

/** 重置筛选器并重新获取 */
const resetAndFetch = () => {
  filters.domain = [];
  filters.type = [];
  filters.minPrice = defaultFilterOptions.minPrice;
  filters.maxPrice = defaultFilterOptions.maxPrice;
  filters.dateRange = Array.from(defaultFilterOptions.dateRange).map((d: Date) => new Date(d));
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
@import '@/styles/variable.less';

.home-container {
  height: calc(100vh - @tab-bar-height - @nav-bar-height - var(--td-navbar-padding-top, 0px) - env(safe-area-inset-bottom));
  background-color: @bg-color-white;

  .home-content {
    height: calc(100%);
    overflow: auto;
    background-color: @bg-color-white;

    /* 隐藏滚动条 (H5/小程序 PC 模拟器) */
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
      -webkit-appearance: none;
      background: transparent;
    }
  }
}

.search-wrap {
  padding: 0 24rpx 24rpx;
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
  display: flex;
  align-items: center;
  height: 96rpx;

  &__tabs {
    flex: 2;

    :deep(.t-tabs) {
      --td-tab-item-tag-height: 72rpx;
      --td-tab-font-size: @font-size-small;
      --td-tab-nav-bg-color: transparent;
    }
  }

  &__filter {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96rpx;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 2rpx;
      height: 44rpx;
      background-color: @gray3;
    }
  }

  &__filter-text {
    margin-left: 4rpx;
    font-size: @font-size-small;
    color: @gy1;
  }
}

.empty-wrap {
  padding: 120rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__hint {
    margin-top: 16rpx;
    font-size: @font-size-small;
    color: @gy3;
  }
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
  color: var(--td-error-color, #e34d59);
}
</style>
