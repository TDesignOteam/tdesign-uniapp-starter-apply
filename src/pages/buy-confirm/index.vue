<template>
  <NavBar title="购买确认" :show-back="true" />
  <view class="buy-page">
    <!-- 活动信息 -->
    <view class="activity-info">
      <text class="activity-info__title">{{ eventTitle }}</text>
      <view class="activity-info__details">
        <view class="activity-info__item">
          <t-icon name="time" size="32rpx" />
          <text>{{ eventDate }}</text>
        </view>
        <view class="activity-info__item">
          <t-icon name="location" size="32rpx" />
          <text>{{ eventLocation }}</text>
        </view>
      </view>
    </view>

    <!-- 人员信息 -->
    <view class="section">
      <view class="section__header">
        <text class="section__title">人员信息</text>
        <t-button size="extra-small" shape="round" icon="add" @click="addPerson">
          增加人员
        </t-button>
      </view>
      <view class="person-grid">
        <view
          v-for="person in persons"
          :key="person.id"
          :class="['card', selectedPersonIds.includes(person.id) ? 'card--active' : '']"
          @click="togglePerson(person.id)"
        >
          <t-icon v-if="selectedPersonIds.includes(person.id)" name="check" size="32rpx" class="card__icon" />
          <text>{{ person.name }}</text>
        </view>
      </view>
    </view>

    <!-- 票类场次 -->
    <view class="section">
      <text class="section__title">票类场次</text>
      <view class="ticket-list">
        <view
          v-for="ticket in tickets"
          :key="ticket.id"
          :class="['card', selectedTicketId === ticket.id ? 'card--active' : '']"
          @click="selectedTicketId = ticket.id"
        >
          <t-icon v-if="selectedTicketId === ticket.id" name="check" size="32rpx" class="card__icon" />
          <text>{{ ticket.date }}</text>
        </view>
      </view>
    </view>

    <!-- 票档价格 -->
    <view class="section">
      <text class="section__title">票档价格</text>
      <view class="price-list">
        <view
          v-for="price in prices"
          :key="price.id"
          :class="['card', selectedPriceId === price.id ? 'card--active' : '']"
          @click="selectedPriceId = price.id"
        >
          <t-icon v-if="selectedPriceId === price.id" name="check" size="32rpx" class="card__icon" />
          <view class="price-card">
            <text>{{ price.description }}</text>
            <view class="price-card__info">
              <text class="price-card__current">{{ price.price }}元</text>
              <text v-if="price.originalPrice > price.price" class="price-card__original">{{ price.originalPrice }}元</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

  <!-- 底部操作栏 -->
  <view class="bottom-action">
    <view class="bottom-action__info">
      <text>待支付:</text>
      <text class="bottom-action__price">¥{{ totalPrice }}</text>
    </view>
    <t-button
      theme="primary"
      size="large"
      :disabled="!canPurchase"
      @click="handleConfirmPurchase"
    >
      确认购买
    </t-button>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';

import { onLoad } from '@dcloudio/uni-app';

import type { TicketItem, PriceItem } from '@/api/activity';
import { getActivityDetail, getActivityTickets, getActivityPrices } from '@/api/activity';
import { userInfoStore, updateSelectedPersonIds } from '@/config/user-info';
import { formatDate } from '@/utils/date';

import NavBar from '@/components/nav-bar.vue';


const activityId = ref('');
const eventTitle = ref('');
const eventDate = ref('');
const eventLocation = ref('');

const persons = computed(() => userInfoStore.persons);
const selectedPersonIds = ref<string[]>([...userInfoStore.selectedPersonIds]);

const tickets = reactive<TicketItem[]>([]);
const selectedTicketId = ref('');

const prices = reactive<PriceItem[]>([]);
const selectedPriceId = ref('');

/** 计算总价 */
const totalPrice = computed(() => {
  const selectedPrice = prices.find(p => p.id === selectedPriceId.value);
  if (!selectedPrice) return 0;

  const personCount = selectedPersonIds.value.length;
  const ticketPersonCount = selectedPrice.person;

  if (ticketPersonCount === 1) {
    return selectedPrice.price * personCount;
  }
  if (personCount >= ticketPersonCount && personCount % ticketPersonCount === 0) {
    return selectedPrice.price * (personCount / ticketPersonCount);
  }
  return selectedPrice.price;
});

/** 是否可以购买 */
const canPurchase = computed(() => {
  return selectedPersonIds.value.length > 0 && selectedTicketId.value && selectedPriceId.value;
});

/** 切换人员选择 */
function togglePerson(id: string) {
  const idx = selectedPersonIds.value.indexOf(id);
  if (idx > -1) {
    selectedPersonIds.value.splice(idx, 1);
  } else {
    selectedPersonIds.value.push(id);
  }
  updateSelectedPersonIds(selectedPersonIds.value);
}

/** 增加人员 */
function addPerson() {
  uni.navigateTo({
    url: '/pages/person-info/index',
  });
}

/** 获取活动数据 */
async function fetchActivityData() {
  if (!activityId.value) return;

  try {
    const activityData = await getActivityDetail(activityId.value);
    eventTitle.value = activityData.title;
    eventDate.value = formatDate(activityData.date);
    eventLocation.value = activityData.address;

    const ticketsData = await getActivityTickets(activityId.value);
    tickets.length = 0;
    tickets.push(...ticketsData);
    if (tickets.length > 0) {
      selectedTicketId.value = tickets[0].id;
    }

    const pricesData = await getActivityPrices(activityId.value);
    prices.length = 0;
    prices.push(...pricesData);
    if (prices.length > 0) {
      selectedPriceId.value = prices[0].id;
    }
  } catch (err) {
    console.error('获取数据失败:', err);
    uni.showToast({ title: '获取数据失败', icon: 'none' });
  }
}

/** 确认购买 */
function handleConfirmPurchase() {
  const selectedPrice = prices.find(p => p.id === selectedPriceId.value);
  if (!selectedPrice) {
    uni.showToast({ title: '请选择票档', icon: 'none' });
    return;
  }

  const personCount = selectedPersonIds.value.length;
  const ticketPersonCount = selectedPrice.person;

  if (personCount < ticketPersonCount) {
    uni.showToast({ title: `当前票档需要至少${ticketPersonCount}人`, icon: 'none' });
    return;
  }

  if (ticketPersonCount > 1 && personCount % ticketPersonCount !== 0) {
    uni.showToast({ title: `选择的人数需要是${ticketPersonCount}的倍数`, icon: 'none' });
    return;
  }

  uni.navigateTo({
    url: `/pages/buy-result/index?id=${activityId.value}`,
  });
}

onLoad((options) => {
  activityId.value = options?.id || '';
  fetchActivityData();
});
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.buy-page {
  padding-bottom: 180rpx;
  background-color: @bg-color;
}

.activity-info {
  padding: 24rpx;
  background-color: @bg-color-white;

  &__title {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    color: @gy1;
    margin-bottom: 16rpx;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: @font-size-small;
    color: @gy2;
  }
}

.section {
  padding: 24rpx;
  margin-top: 16rpx;
  background-color: @bg-color-white;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }

  &__title {
    display: block;
    font-size: @font-size-default;
    font-weight: 600;
    color: @gy1;
    margin-bottom: 16rpx;
  }
}

.person-grid,
.ticket-list,
.price-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.card {
  position: relative;
  padding: 20rpx 32rpx;
  border: 2rpx solid @gray3;
  border-radius: 12rpx;
  font-size: @font-size-small;
  color: @gy1;

  &--active {
    border-color: @brand7-normal;
    color: @brand7-normal;
  }

  &__icon {
    position: absolute;
    top: 4rpx;
    right: 4rpx;
    color: @brand7-normal;
  }
}

.price-card {
  &__info {
    display: flex;
    gap: 8rpx;
    margin-top: 8rpx;
  }

  &__current {
    font-size: @font-size-default;
    font-weight: 600;
    color: #e34d59;
  }

  &__original {
    font-size: @font-size-mini;
    color: @gy3;
    text-decoration: line-through;
  }
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: @bg-color-white;
  box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.05);

  &__info {
    margin-right: 24rpx;
    font-size: @font-size-small;
    color: @gy2;
    white-space: nowrap;
  }

  &__price {
    font-size: 40rpx;
    font-weight: 600;
    color: #e34d59;
    margin-left: 8rpx;
  }
}
</style>
