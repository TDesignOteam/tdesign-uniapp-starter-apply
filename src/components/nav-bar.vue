<template>
  <view class="nav-bar-wrap">
    <t-navbar
      :title="title"
      :left-arrow="showBack"
      placeholder
      @left-click="goBack"
    >
      <template
        v-if="showLocation"
        #left
      >
        <view
          class="nav-bar__left"
          @click="goSelectLocation"
        >
          <t-icon
            name="location"
            size="32rpx"
          />
          <text class="nav-bar__location-text">
            {{ locationName }}
          </text>
        </view>
      </template>
    </t-navbar>
  </view>
</template>

<script setup lang="ts">
import { userInfoStore } from '@/config/user-info';

defineProps({
  title: {
    type: String,
    default: '',
  },
  showBack: {
    type: Boolean,
    default: false,
  },
  showLocation: {
    type: Boolean,
    default: false,
  },
});

const { locationName } = userInfoStore;

const goBack = () => {
  uni.navigateBack();
};

const goSelectLocation = () => {
  uni.navigateTo({
    url: '/pages/select-location/index',
  });
};

defineOptions({
  styleIsolation: 'shared',
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.nav-bar__left {
  display: flex;
  align-items: center;
  padding: 0 16rpx;
}

.nav-bar__location-text {
  margin-left: 8rpx;
  font-size: @font-size-small;
  line-height: 44rpx;
}
</style>
