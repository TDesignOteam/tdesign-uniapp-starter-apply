<template>
  <t-popup
    :visible="true"
    placement="bottom"
    :show-overlay="false"
    :custom-style="{ height: popupHeight }"
    custom-class="detail-popup-wrapper"
  >
    <view class="detail-popup">
      <!-- 收起时展示的小把手 -->
      <!-- <view
        v-show="!showBottomPopup"
        class="detail-popup__handle"
        @click="onToggle"
      >
        <view class="detail-popup__handle-bar" />
      </view> -->

      <!-- 展开/收起切换按钮 -->
      <view
        v-if="showToggleIcon"
        class="detail-popup__toggle"
        :class="{ 'detail-popup__toggle--active': showBottomPopup }"
        @click="onToggle"
      >
        <t-icon
          :name="showBottomPopup ? 'chevron-down' : 'chevron-up'"
          size="40rpx"
        />
      </view>

      <!-- 弹层内容区域 -->
      <scroll-view
        v-show="showBottomPopup"
        scroll-y
        :show-scrollbar="false"
        class="detail-popup__content"
      >
        <template v-if="detail">
          <!-- 活动概要：标题 + 感兴趣人数 -->
          <view class="popup-summary">
            <text class="popup-summary__title">
              {{ detail.title }}
            </text>
            <view
              v-if="avatarList.length > 0"
              class="popup-summary__avatars"
            >
              <t-avatar-group
                cascading="right-up"
                :max="5"
                size="small"
                collapse-avatar="+61"
              >
                <t-avatar
                  v-for="(url, index) in avatarList"
                  :key="index"
                  :image="url"
                  shape="circle"
                />
              </t-avatar-group>
              <text class="popup-summary__interest">
                {{ interestedCount }}人感兴趣
              </text>
            </view>
          </view>

          <!-- 时间/地点 -->
          <view class="popup-meta">
            <view class="popup-meta__row">
              <view class="popup-meta__item">
                <t-icon
                  name="time"
                  size="36rpx"
                  color="#0052d9"
                />
                <text class="popup-meta__text">
                  时间：{{ dateText }}
                </text>
              </view>
            </view>
            <view class="popup-meta__row popup-meta__row--between">
              <view class="popup-meta__item">
                <t-icon
                  name="location"
                  size="36rpx"
                  color="#0052d9"
                />
                <text class="popup-meta__text">
                  地点：{{ detail.address }}
                </text>
              </view>
              <t-button
                size="extra-small"
                theme="light"
                @click="handleNavigate"
              >
                导航
              </t-button>
            </view>
          </view>

          <!-- 活动评价 -->
          <view
            v-if="detail.comments && detail.comments.length > 0"
            class="popup-reviews"
          >
            <view class="popup-reviews__header">
              <text class="popup-reviews__title">
                活动评价({{ detail.comments.length }})
              </text>
              <view class="popup-reviews__rate">
                <t-rate
                  :value="detail.score"
                  size="36rpx"
                  variant="filled"
                  allow-half
                  show-text
                  disabled
                />
              </view>
            </view>
            <scroll-view
              scroll-x
              :show-scrollbar="false"
              class="popup-reviews__list"
            >
              <view class="popup-reviews__scroll">
                <view
                  v-for="comment in detail.comments"
                  :key="comment.id"
                  class="popup-reviews__card"
                >
                  <view class="review-card__header">
                    <t-avatar
                      shape="circle"
                      :image="comment.avatar"
                      size="small"
                    />
                    <text class="review-card__user">
                      {{ comment.user }}
                    </text>
                  </view>
                  <text class="review-card__content">
                    {{ comment.content }}
                  </text>
                </view>
              </view>
            </scroll-view>
          </view>

          <!-- 活动介绍 -->
          <view class="popup-intro">
            <text class="popup-intro__title">
              活动介绍
            </text>
            <text class="popup-intro__content">
              {{ detail.introduce }}
            </text>
          </view>
        </template>

        <!-- 骨架屏加载态 -->
        <template v-else>
          <view class="popup-skeleton">
            <t-skeleton
              :loading="true"
              animation="flashed"
              :row-col="[{ height: '56rpx', width: '60%' }]"
            />
            <view style="height: 24rpx" />
            <t-skeleton
              :loading="true"
              animation="flashed"
              :row-col="[{ height: '72rpx', width: '50%' }]"
            />
            <view style="height: 24rpx" />
            <t-skeleton
              :loading="true"
              animation="flashed"
              :row-col="[{ height: '40rpx', width: '100%' }, { height: '40rpx', width: '70%' }]"
            />
            <view style="height: 24rpx" />
            <t-skeleton
              :loading="true"
              animation="flashed"
              :row-col="[{ height: '184rpx', width: '100%' }]"
            />
            <view style="height: 24rpx" />
            <t-skeleton
              :loading="true"
              animation="flashed"
              :row-col="[{ height: '44rpx', width: '40%' }, { height: '120rpx', width: '100%' }]"
            />
          </view>
        </template>
      </scroll-view>
    </view>
  </t-popup>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';

import type { ActivityDetail } from '@/api/activity';

import { formatDate } from '@/utils/date';


interface Props {
  /** 活动详情数据 */
  detail?: ActivityDetail | null;
  /** 底部弹层展开状态 */
  showBottomPopup?: boolean;
  /** 弹层高度 */
  popupHeight?: string;
}
const showToggleIcon = ref(false);
onMounted(() => {
  setTimeout(() => {
    showToggleIcon.value = true;
  }, 500);
});

const props = withDefaults(defineProps<Props>(), {
  detail: null,
  showBottomPopup: true,
  popupHeight: '80vh',
});

const emit = defineEmits<{(e: 'toggle'): void;
}>();

/** 处理弹层切换 */
function onToggle() {
  emit('toggle');
}

/** 感兴趣用户头像列表 */
const avatarList = computed<string[]>(() => (props.detail?.interestedPeople ?? []).map(person => person.avatar));

/** 感兴趣人数 */
const interestedCount = computed<number>(() => props.detail?.interestedCount ?? 0);

/** 格式化后的活动日期 */
const dateText = computed<string>(() => {
  const date = props.detail?.date;
  return date ? formatDate(date as string | number | Date) : '';
});

/** 点击导航 */
function handleNavigate() {
  const address = props.detail?.address;
  if (!address) {
    uni.showToast({ title: '暂无地址信息', icon: 'none' });
    return;
  }
  // #ifdef MP-WEIXIN
  uni.openLocation?.({
    latitude: 22.5429,
    longitude: 113.9344,
    name: address,
    address,
    fail: () => {
      uni.showToast({ title: '打开地图失败', icon: 'none' });
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni.showToast({ title: `目的地：${address}`, icon: 'none' });
  // #endif
}
</script>

<style lang="less" scoped>
@import '@/styles/variable.less';

.detail-popup {
  display: flex;
  flex-direction: column;
  border-radius: 24rpx 24rpx 0 0;
  background-color: @bg-color-white;
  position: relative;
  height: 100%;
  padding-top: 24rpx;

  &__content {
    flex: 1;
    padding: 24rpx 32rpx;
    padding-bottom: 160rpx;
    box-sizing: border-box;
    height: 100%;

    /* 隐藏纵向滚动条 (H5/小程序 PC 模拟器) */
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
      -webkit-appearance: none;
      background: transparent;
    }
  }

  &__handle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 152rpx;
    height: 22rpx;
    top: -20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: @bg-color-white;
    border-radius: 22rpx 22rpx 0 0;
  }

  &__handle-bar {
    width: 64rpx;
    height: 8rpx;
    border-radius: 4rpx;
    background-color: @gray3;
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 22rpx;
    width: 100%;
    position: absolute;
    z-index: 99;
    top: -22rpx;
    color: @gy3;
    background: url(https://cdn.uwayfly.com/tdesign-uniapp/starter-apply/half-circle.png) no-repeat center center;
    background-size: 100% 100%;
    width: 76px;
    left: 50%;
    transform: translateX(-50%);
    padding-top: 3px;
  }

  &__toggle--active {
    height: 88rpx;
    top: -64rpx;
    z-index: -1;
    padding-bottom: 24rpx;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3));
    border-radius: 24rpx 24rpx 0 0;
    color: #fff;
    padding-top: 0;
  }
}

/* 活动概要 */
.popup-summary {
  padding-bottom: 32rpx;
  border-bottom: 1rpx solid @gray3;

  &__title {
    display: block;
    font-size: 40rpx;
    font-weight: 600;
    color: @gy1;
  }

  &__avatars {
    margin-top: 24rpx;
    display: flex;
    gap: 16rpx;
    align-items: center;
  }

  &__interest {
    font-size: @font-size-mini;
    color: @gy2;
  }
}

/* 时间地点 */
.popup-meta {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 32rpx 0;
  border-bottom: 1rpx solid @gray3;

  &__row {
    display: flex;
    align-items: center;
  }

  &__row--between {
    justify-content: space-between;
  }

  &__item {
    display: flex;
    align-items: center;
  }

  &__text {
    margin-left: 8rpx;
    font-size: @font-size-small;
    color: @gy1;
  }
}

/* 活动评价 */
.popup-reviews {
  padding: 32rpx 0;
  border-bottom: 1rpx solid @gray3;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: @font-size-default;
    font-weight: 600;
    color: @gy1;
  }

  &__rate {
    :deep(.t-rate__text) {
      margin-left: 8rpx;
      font-size: @font-size-small;
    }
  }

  &__list {
    margin-top: 24rpx;
    white-space: nowrap;

    /* 隐藏横向滚动条 */
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: none;
      -webkit-appearance: none;
      background: transparent;
    }
  }

  &__scroll {
    display: flex;
    gap: 16rpx;
  }

  &__card {
    flex-shrink: 0;
    width: 520rpx;
    padding: 24rpx;
    background-color: @bg-color;
    border-radius: 16rpx;
  }
}

.review-card {
  &__header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 12rpx;
  }

  &__user {
    font-size: @font-size-small;
    font-weight: 500;
    color: @gy1;
  }

  &__content {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    font-size: @font-size-mini;
    color: @gy2;
    line-height: 36rpx;
    box-sizing: border-box;
  }
}

/* 活动介绍 */
.popup-intro {
  padding-top: 32rpx;

  &__title {
    display: block;
    font-size: @font-size-default;
    font-weight: 600;
    color: @gy1;
  }

  &__content {
    display: block;
    margin-top: 24rpx;
    font-size: @font-size-small;
    color: @gy2;
    line-height: 44rpx;
  }
}

/* 骨架屏 */
.popup-skeleton {
  padding: 16rpx 0;
}
</style>
