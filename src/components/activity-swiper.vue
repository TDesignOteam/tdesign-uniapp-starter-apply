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
    >
      <t-swiper
        :list="swiperData"
        :autoplay="autoplay"
        :navigation="resolvedNavigation"
        :height="height"
        :loop="loop"
        :interval="interval"
        :image-props="{ mode: 'aspectFill',shape: 'round' }"
        previous-margin="34px"
        next-margin="34px"
        @click="onItemClick"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

const emit = defineEmits<{
  /** 点击轮播项时触发，返回对应的 SwiperItem */
  (e: 'click', item: SwiperItem): void;
}>();

/**
 * 将业务数据转换为 t-swiper 的 SwiperList[] 格式
 * t-swiper 接受 string[] 或 { value: string; ariaLabel: string }[]
 */
const swiperData = computed(() => props.list.map(item => ({
  value: item.url,
  ariaLabel: item.name,
})));

const swiperCustomStyle = computed(() => {
  const result = 'margin: 0 calc(calc(100vw - var(--swiper-width)) / 2 - 12px) 0 calc(calc(100vw - var(--swiper-width)) / 2)';
  return result;
});

/** 导航器默认配置 */
const resolvedNavigation = computed(() => {
  if (props.navigation === false) return false;
  return props.navigation ?? { type: 'dots', placement: 'bottom' };
});

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
    --td-swiper-item-padding: 0 12rpx;
    --td-swiper-nav-dot-color: var(--td-bg-color-component, #e7e7e7);
    --td-swiper-nav-dot-active-color: var(--td-brand-color, #0052d9);

    padding-bottom: 18px;


    // .swiper {
      // overflow: visible;
      // :deep(.t-image) {
      //   width: var(--swiper-width);
      //   height: 100%;
      //   box-shadow: var(--td-shadow-3);
      // }
    }
  // }
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
