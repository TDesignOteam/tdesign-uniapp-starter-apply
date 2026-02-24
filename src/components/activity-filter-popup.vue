<template>
  <view>
    <!-- 筛选弹窗 -->
    <t-popup
      :visible="visible"
      placement="bottom"
      @visible-change="onPopupVisibleChange"
    >
      <view class="filter-popup">
        <view class="filter-popup__header">
          <text class="filter-popup__header-title">
            全部筛选
          </text>
          <view @click="closePopup">
            <t-icon
              name="close"
              size="48rpx"
            />
          </view>
        </view>

        <scroll-view
          scroll-y
          class="filter-popup__content"
        >
          <!-- 面向领域 -->
          <TagFilter
            v-model:model-value="tmpFilters.domain"
            title="面向领域"
            :options="options.domain"
          />

          <!-- 活动形式 -->
          <TagFilter
            v-model:model-value="tmpFilters.type"
            title="活动形式"
            :options="options.type"
          />

          <!-- 活动日期 -->
          <view class="filter-section">
            <text class="filter-section__title">
              活动日期
            </text>
            <view class="filter-section__date-row">
              <text>{{ dateRangeText }}</text>
              <t-button
                theme="default"
                size="extra-small"
                shape="round"
                @click="calendarVisible = true"
              >
                选择日期
              </t-button>
            </view>
          </view>

          <!-- 价格范围 -->
          <view class="filter-section">
            <text class="filter-section__title">
              价格范围(元)
            </text>
            <view class="filter-section__slider">
              <t-slider
                :value="priceRange"
                range
                :min="options.minPrice"
                :max="options.maxPrice"
                show-extreme-value
                label
                @change="onPriceChange"
              />
            </view>
          </view>
        </scroll-view>

        <view class="filter-popup__footer">
          <t-button
            theme="light"
            variant="base"
            size="large"
            style="flex: 1"
            @click="handleReset"
          >
            重置
          </t-button>
          <t-button
            theme="primary"
            size="large"
            style="flex: 1"
            @click="handleApply"
          >
            完成
          </t-button>
        </view>
      </view>
    </t-popup>

    <!-- 日历弹窗 -->

    <!-- <t-popup
      :visible="calendarVisible"
      placement="bottom"
      @visible-change="onCalendarVisibleChange"
    >
      <view class="calendar-popup"> -->
    <t-calendar
      v-model:value="tmpCalendarValue"
      :visible="calendarVisible"
      :min-date="calendarMinDate"
      :max-date="calendarMaxDate"
      type="range"
      :use-popup="true"
      title=" "
      @confirm="confirmCalendar"
    >
      <template #title>
        <view class="calendar-popup__title-row">
          <view @click="closeCalendar">
            <t-icon
              name="chevron-left"
              size="48rpx"
            />
          </view>
          <text class="calendar-popup__title">
            选择日期
          </text>
          <view @click="closeCalendar">
            <t-icon
              name="close"
              size="48rpx"
            />
          </view>
        </view>
      </template>
    </t-calendar>
    <!-- <view class="calendar-popup__footer">
          <t-button
            theme="primary"
            size="large"
            block
            @click="confirmCalendar"
          >
            确定日期
          </t-button>
        </view>
      </view>
    </t-popup> -->
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import TagFilter from '@/components/tag-filter.vue';
import { defaultFilterOptions } from '@/constant/filters';

import { formatDateRange } from '@/utils/date';

import type { ActivityFilterParams } from '@/api/activity';


const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  filters: {
    type: Object as () => ActivityFilterParams,
    required: true,
  },
  options: {
    type: Object,
    default: () => defaultFilterOptions,
  },
});

const emit = defineEmits(['update:visible', 'update:filters', 'reset']);

const calendarVisible = ref(false);

// 临时筛选状态（在弹窗内编辑，不直接修改 props）
const tmpFilters = ref<ActivityFilterParams>({
  domain: [],
  type: [],
  minPrice: 0,
  maxPrice: 0,
  dateRange: [],
});

// 日历临时选中的值
const tmpCalendarValue = ref<number[]>([]);

// 日历日期范围限制
const calendarMinDate = computed(() => props.options.dateRange[0]?.getTime());
const calendarMaxDate = computed(() => props.options.dateRange[1]?.getTime());

// 价格范围
const priceRange = computed(() => [tmpFilters.value.minPrice, tmpFilters.value.maxPrice]);

// 日期范围文本
const dateRangeText = computed(() => formatDateRange(tmpFilters.value.dateRange));

/** 同步 props.filters 到 tmpFilters */
function syncFilters() {
  const f = props.filters;
  tmpFilters.value = {
    domain: Array.isArray(f.domain) ? Array.from(f.domain) : [],
    type: Array.isArray(f.type) ? Array.from(f.type) : [],
    minPrice: f.minPrice ?? 0,
    maxPrice: f.maxPrice ?? 0,
    dateRange: Array.isArray(f.dateRange) ? Array.from(f.dateRange).map((d: Date) => new Date(d)) : [],
  };
}

watch(
  () => props.filters,
  () => {
    syncFilters();
  },
  { deep: true, immediate: true },
);

/** 价格滑块变化 */
function onPriceChange({ value }:{value: number | number[]}) {
  if (Array.isArray(value)) {
    tmpFilters.value.minPrice = value[0];
    tmpFilters.value.maxPrice = value[1];
  }
}

/** 弹窗可见性变化 */
function onPopupVisibleChange({ visible }: { visible: boolean }) {
  if (!visible) {
    syncFilters(); // 关闭时恢复
  }
  emit('update:visible', visible);
}

/** 关闭筛选弹窗 */
function closePopup() {
  syncFilters();
  emit('update:visible', false);
}

/** 重置筛选 */
function handleReset() {
  emit('reset');
  emit('update:visible', false);
}

/** 应用筛选 */
function handleApply() {
  emit('update:filters', { ...tmpFilters.value });
  emit('update:visible', false);
}

/** 日历选择 */
function onCalendarSelect({ value }) {
  tmpCalendarValue.value = value;
}

/** 日历弹窗可见性变化 */
function onCalendarVisibleChange({ visible }:{visible: boolean}) {
  calendarVisible.value = visible;
}

/** 关闭日历 */
function closeCalendar() {
  calendarVisible.value = false;
}

/** 确认日历选择 */
function confirmCalendar() {
  if (tmpCalendarValue.value && tmpCalendarValue.value.length === 2) {
    tmpFilters.value.dateRange = tmpCalendarValue.value.map((ts: number) => new Date(ts));
  }
  calendarVisible.value = false;
}

defineOptions({
  styleIsolation: 'shared',
});
</script>

<style lang="less" scoped>
@import '@/styles/variable.less';

.filter-popup {
  display: flex;
  flex-direction: column;
  padding: 32rpx 0 0;
  height: min(84vh, 656px);
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 32rpx;
    margin-bottom: 28rpx;
    position: relative;
    box-sizing: border-box;
  }

  &__header-title {
    font-size: 36rpx;
    font-weight: 600;
    color: @gy1;
    flex: 1;
    text-align: center;
    margin-left: 1.5rem;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 32rpx;
    box-sizing: border-box;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
    ::-webkit-scrollbar {
      display: none;
      /* Chrome, Safari, Opera */
    }
  }

  &__footer {
    display: flex;
    gap: 16rpx;
    padding: 32rpx;
  }
}

.filter-section {
  padding: 48rpx 0;
  border-top: 1rpx solid @gray3;

  &__title {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: @gy1;
  }

  &__date-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16rpx;
    font-size: 32rpx;
    color: @gy1;
  }

  &__slider {
    padding: 32rpx 0 48rpx;
  }
}

.calendar-popup {
  display: flex;
  flex-direction: column;
  height: min(calc(100vh - 32rpx), 1200rpx);
  position: relative;
  padding-bottom: 120rpx;

  &__title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 32rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: @gy1;
  }

  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 32rpx;
    background: @bg-color-white;
    z-index: 9999;
  }
}

:deep(.t-calendar__close-btn) {
  display: none;
}
</style>
