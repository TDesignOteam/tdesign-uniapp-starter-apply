<template>
  <view>
    <text class="tag-filter__title">
      {{ title }}
    </text>
    <view class="tag-filter__container">
      <view
        v-for="item in options"
        :key="item"
        :class="['tag-filter__tag', modelValue.includes(item) ? 'tag-filter__tag--active' : '']"
        @click="handleToggle(item)"
      >
        <text>{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  options: {
    type: Array as () => string[],
    required: true,
  },
  modelValue: {
    type: Array as () => string[],
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

function handleToggle(item: string) {
  const index = props.modelValue.indexOf(item);
  const newValue = [...props.modelValue];
  if (index > -1) {
    newValue.splice(index, 1);
  } else {
    newValue.push(item);
  }
  emit('update:modelValue', newValue);
}

defineOptions({
  styleIsolation: 'shared',
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.tag-filter {
  &__title {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    line-height: 44rpx;
    color: @gy1;
  }

  &__container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24rpx;
    margin: 24rpx 0 48rpx 0;
  }

  &__tag {
    height: 80rpx;
    font-size: 28rpx;
    line-height: 44rpx;
    border-radius: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: @bg-color;

    &--active {
      color: @brand7-normal;
      border: 2rpx solid @brand7-normal;
      background: var(--td-brand-color-1, #ecf2fe);
    }
  }
}
</style>
