<template>
  <view class="skeleton-card" v-for="i in count" :key="i">
    <t-skeleton
      animation="flashed"
      :loading="true"
      :row-col="[{ width: '200rpx', height: '200rpx', borderRadius: '8rpx' }]"
    />
    <view class="skeleton-card__info">
      <t-skeleton
        animation="flashed"
        :loading="true"
        :row-col="[{ height: '32rpx', width: '60%' }]"
      />
      <slot />
      <t-skeleton
        animation="flashed"
        :loading="true"
        :row-col="[{ height: '28rpx', width: '40%' }]"
        custom-style="margin-top: 16rpx"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps({
  count: {
    type: Number,
    default: 3,
  },
});

defineOptions({
  styleIsolation: 'shared',
});
</script>

<style lang="less" scoped>
.skeleton-card {
  display: flex;
  padding: 24rpx;
  margin-bottom: 16rpx;

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 24rpx;
  }
}
</style>
