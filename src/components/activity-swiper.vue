<template>
  <view class="activity-swiper">
    <!-- 加载中 / 空状态占位 -->
    <view
      v-if="loading || list.length === 0"
      class="activity-swiper__placeholder"
    >
      <view class="placeholder-wrapper">
        <view
          v-if="marginPosition !== 'right'"
          class="placeholder-side"
          style="border-radius: 0 16rpx 16rpx 0; margin-right: 16rpx"
        />
        <view class="placeholder-main">
          <text
            v-if="!loading && list.length === 0"
            class="placeholder-main__empty"
          >
            暂无轮播图数据
          </text>
        </view>
        <view
          v-if="marginPosition !== 'left'"
          class="placeholder-side"
          style="border-radius: 16rpx 0 0 16rpx; margin-left: 16rpx"
        />
      </view>
      <view class="placeholder-dots">
        <t-loading
          v-if="loading"
          theme="dots"
          size="30px"
          :duration="5000"
        />
      </view>
    </view>

    <!-- 轮播图 -->
    <view
      v-if="!loading && list.length > 0"
      class="activity-swiper__content"
      :style="contentStyle"
    >
      <t-swiper
        :current="currentIndex"
        :list="swiperData"
        :autoplay="autoplay"
        :navigation="false"
        :height="height"
        :loop="loop"
        :interval="interval"
        :image-props="{ mode: 'aspectFill',shape: 'round' }"
        :previous-margin="previousMargin"
        :next-margin="nextMargin"
        @change="onSwiperChange"
        @click="onItemClick"
      />
      <!-- 外部独立圆点指示器（设计稿位置） -->
      <view
        v-if="showDots && list.length > 1"
        class="activity-swiper__dots"
      >
        <view
          v-for="(_item, idx) in list"
          :key="idx"
          class="activity-swiper__dot"
          :class="{ 'activity-swiper__dot--active': idx === currentIndex }"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

/** 轮播图数据项 */
export interface SwiperItem {
  /** 唯一标识 */
  id: string;
  /** 名称/描述 */
  name: string;
  /** 图片地址 */
  url: string;
}

const props = withDefaults(
  defineProps<{
    /** 轮播图数据列表 */
    list: SwiperItem[];
    /** 是否正在加载 */
    loading?: boolean;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 是否循环播放 */
    loop?: boolean;
    /** 轮播间隔时间（ms） */
    interval?: number;
    /** 导航器配置，传 false 可隐藏导航器 */
    navigation?: Record<string, any> | boolean;
    /** 高度，支持 rpx/px 单位字符串或数字 */
    height?: string | number;
    /** 边距位置：both-两侧 / right-仅右侧 / left-仅左侧 */
    marginPosition?: 'both' | 'right' | 'left';
  }>(),
  {
    loading: false,
    autoplay: true,
    loop: true,
    interval: 5000,
    navigation: undefined,
    height: 300,
    marginPosition: 'both',
  },
);

const emit = defineEmits<{(e: 'click', item: SwiperItem): void;
}>();

/** 当前轮播索引 */
const currentIndex = ref(0);

/** 是否展示外部圆点（navigation 为 false 时不展示） */
const showDots = computed(() => props.navigation !== false);

/** 根据 marginPosition 计算左/右露出的边距 */
const SIDE_MARGIN = '34px'; // 用于露出"上一张/下一张"的预览宽度
const EDGE_MARGIN = '16px'; // 不露出方向上保留的最小留白，避免完全贴边
const previousMargin = computed(() => (props.marginPosition === 'right' ? EDGE_MARGIN : SIDE_MARGIN));
const nextMargin = computed(() => (props.marginPosition === 'left' ? EDGE_MARGIN : SIDE_MARGIN));

/** 根据 marginPosition 动态调整 swiper item padding，使第一张/最后一张可以贴边 */
const contentStyle = computed(() => {
  if (props.marginPosition === 'right') {
    // 仅右侧露出：左边由 previousMargin 提供留白，item 之间用右 padding 拉开
    return '--td-swiper-item-padding: 0 24rpx 0 0;';
  }
  if (props.marginPosition === 'left') {
    return '--td-swiper-item-padding: 0 0 0 24rpx;';
  }
  return '--td-swiper-item-padding: 0 12rpx;';
});

/**
 * 将业务数据转换为 t-swiper 的 SwiperList[] 格式
 * t-swiper 接受 string[] 或 { value: string; ariaLabel: string }[]
 */
const swiperData = computed(() => props.list.map(item => ({
  value: item.url,
  ariaLabel: item.name,
})));

/** swiper 切换 */
const onSwiperChange = (e: { current: number } | { detail: { current: number } } | any) => {
  const cur = e?.current ?? e?.detail?.current;
  if (typeof cur === 'number') {
    currentIndex.value = cur;
  }
};

/** 点击轮播项 */
const onItemClick = (context: { index: number }) => {
  const item = props.list[context.index];
  if (item) {
    emit('click', item);
  }
};
</script>

<style lang="less" scoped>
@import '@/styles/variable.less';

.activity-swiper {
  width: 100%;

  &__placeholder {
    width: 100%;
  }

  &__content {
    width: 100%;

    --td-swiper-radius: 0;
  }

  /* 外部圆点指示器（设计稿位置：swiper 下方独立一行） */
  &__dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8rpx;
    padding: 32rpx 0 8rpx;
  }

  &__dot {
    width: 10rpx;
    height: 10rpx;
    border-radius: 50%;
    background-color: var(--td-bg-color-component, #e7e7e7);
    transition: background-color 0.2s ease, width 0.2s ease;

    &--active {
      width: 20rpx;
      border-radius: 5rpx;
      background-color: var(--td-brand-color, #0052d9);
    }
  }
}

.placeholder-wrapper {
  display: flex;
  align-items: center;
  height: 300rpx;
}

.placeholder-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 16rpx;
  background-color: @bg-color;

  &__empty {
    font-size: @font-size-small;
    color: @gy3;
  }
}

.placeholder-side {
  width: 60rpx;
  height: 100%;
  background-color: @bg-color;
}

.placeholder-dots {
  display: flex;
  justify-content: center;
  height: 36rpx;
  margin-top: 8rpx;
}
</style>
