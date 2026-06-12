<template>
  <view>
    <NavBar
      title="选择城市"
      :show-back="true"
    />
    <view class="location-page">
      <!-- 当前定位 -->
      <view class="location-current">
        <view class="location-current__info">
          <t-icon
            name="location"
            size="44rpx"
          />
          <text class="location-current__name">
            {{ locationName }}
          </text>
        </view>
      </view>

      <!-- 城市列表 -->
      <view class="city-list">
        <t-indexes
          :index-list="indexList"
          :sticky="false"
        >
          <template
            v-for="item in cityList"
            :key="`city-index-${item.index}`"
          >
            <t-indexes-anchor :index="item.index" />
            <t-cell-group>
              <t-cell
                v-for="(val, i) in item.children"
                :key="`city-${i}`"
                @click="updateCity(val.name)"
              >
                <template #title>
                  <text
                    :style="{ color: locationName === val.name ? '#0052d9' : '' }"
                  >
                    {{ val.label }}
                  </text>
                </template>
                <template
                  v-if="locationName === val.name"
                  #right-icon
                >
                  <t-icon
                    name="check"
                    size="48rpx"
                    color="#0052d9"
                  />
                </template>
              </t-cell>
            </t-cell-group>
          </template>
        </t-indexes>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import { handlePageScroll } from '@tdesign/uniapp';

import request from '@/api/request';

import NavBar from '@/components/nav-bar.vue';
import { userInfoStore, updateLocationName } from '@/config/user-info';


defineOptions({
  onPageScroll(e) {
    handlePageScroll(e);
  },
});

interface CityItem {
  name: string;
  label: string;
}

interface CityGroup {
  index: string;
  children: CityItem[];
}

const locationName = ref(userInfoStore.locationName);
const cityList = ref<CityGroup[]>([]);
const indexList = computed(() => cityList.value.map(item => item.index));

/** 更新城市 */
function updateCity(cityName: string) {
  locationName.value = cityName;
  updateLocationName(cityName);
  uni.navigateBack();
}

/** 获取城市列表 */
async function fetchCities() {
  try {
    const res = await request('/cities');
    cityList.value = res.data;
  } catch (err) {
    console.error('获取城市列表失败:', err);
  }
}

onMounted(() => {
  fetchCities();
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.location-page {
  min-height: 100vh;
  background-color: @bg-color;
}

.location-current {
  padding: 24rpx 32rpx;
  background-color: @bg-color-white;
  margin-bottom: 16rpx;

  &__info {
    display: flex;
    align-items: center;
  }

  &__name {
    margin-left: 12rpx;
    font-size: @font-size-default;
    font-weight: 500;
    color: @gy1;
  }
}

.city-list {
  background-color: @bg-color-white;
}
</style>
