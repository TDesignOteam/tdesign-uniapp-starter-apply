<template>
  <view
    class="activity-card"
    @click="$emit('click')"
  >
    <t-image
      t-class="activity-card__image"
      custom-style="width: 200rpx;height:200rpx;border-radius: 8rpx;"
      :src="cover"
      mode="aspectFill"
    />
    <view class="activity-card__info">
      <text class="activity-card__title">
        {{ title }}
      </text>
      <view class="activity-card__content">
        <slot name="content" />
      </view>
      <view class="activity-card__footer">
        <slot name="footer" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  cover: string;
  title: string;
}>();

defineEmits(['click']);

defineOptions({
  styleIsolation: 'shared',
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.activity-card {
  display: flex;
  padding: 24rpx;
  background: @bg-color-white;
  border-radius: 18rpx;
  margin-bottom: 24rpx;
  /* 设计稿外阴影 */
  box-shadow:
    0 12rpx 60rpx 10rpx rgba(0, 0, 0, 0.05),
    0 32rpx 48rpx 4rpx rgba(0, 0, 0, 0.04),
    0 16rpx 20rpx -10rpx rgba(0, 0, 0, 0.08);

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 24rpx;
    overflow: hidden;
  }

  &__title {
    font-size: @font-size-default;
    font-weight: 500;
    color: @gy1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__content {
    flex: 1;
    margin-top: 8rpx;
  }

  &__footer {
    margin-top: 8rpx;
  }
}
</style>
