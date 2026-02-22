<template>
  <NavBar title="个人信息" :show-back="true" />
  <view class="person-page">
    <view class="form-container">
      <t-cell-group>
        <!-- 设为默认 -->
        <t-cell title="设为默认" :bordered="false">
          <template #right-icon>
            <t-switch v-model="isDefault" />
          </template>
        </t-cell>

        <!-- 姓名 -->
        <t-cell title="姓名" required :bordered="false">
          <template #right-icon>
            <t-input
              v-model="formData.name"
              placeholder="请输入姓名"
              borderless
              align="right"
              :maxlength="30"
            />
          </template>
        </t-cell>

        <!-- 生日 -->
        <t-cell title="生日" required :bordered="false" @click="showDatePicker = true">
          <template #right-icon>
            <text class="form-value">{{ formData.birthday || '请选择生日' }}</text>
          </template>
        </t-cell>

        <!-- 手机号 -->
        <t-cell title="手机号" required :bordered="false">
          <template #right-icon>
            <t-input
              v-model="formData.phone"
              placeholder="请输入手机号"
              borderless
              align="right"
              :maxlength="11"
            />
          </template>
        </t-cell>

        <!-- 身份证 -->
        <t-cell title="身份证" required :bordered="false">
          <template #right-icon>
            <t-input
              v-model="formData.idCard"
              placeholder="请输入身份证号码"
              borderless
              align="right"
              :maxlength="18"
            />
          </template>
        </t-cell>

        <!-- 邮箱 -->
        <t-cell title="邮箱" :bordered="false">
          <template #right-icon>
            <t-input
              v-model="formData.email"
              placeholder="请输入邮箱"
              borderless
              align="right"
              :maxlength="35"
            />
          </template>
        </t-cell>

        <!-- 职业 -->
        <t-cell title="职业" arrow :bordered="false" @click="showProfessionPicker = true">
          <template #right-icon>
            <text class="form-value">{{ formData.profession || '请选择职业' }}</text>
          </template>
        </t-cell>
      </t-cell-group>
    </view>

    <!-- 底部确认按钮 -->
    <view class="bottom-action">
      <t-button theme="primary" block size="large" @click="handleConfirm">
        确定
      </t-button>
    </view>

    <!-- 日期选择器 -->
    <t-popup :visible="showDatePicker" placement="bottom" @visible-change="onDatePopupChange">
      <t-date-time-picker
        :value="datePickerValue"
        title="选择生日"
        :mode="['date']"
        start="1950-01-01"
        end="2010-12-31"
        format="YYYY-MM-DD"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </t-popup>

    <!-- 职业选择器 -->
    <t-popup :visible="showProfessionPicker" placement="bottom" @visible-change="onProfessionPopupChange">
      <t-picker
        :value="professionPickerValue"
        title="选择职业"
        :columns="professionColumns"
        @confirm="onProfessionConfirm"
        @cancel="showProfessionPicker = false"
      />
    </t-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

import { addPerson } from '@/config/user-info';
import { formatDate } from '@/utils/date';

import NavBar from '@/components/nav-bar.vue';


const isDefault = ref(false);
const showDatePicker = ref(false);
const showProfessionPicker = ref(false);
const datePickerValue = ref('1994-09-27');
const professionPickerValue = ref(['设计师/艺术从业者']);

const formData = reactive({
  name: '',
  birthday: '',
  phone: '',
  idCard: '',
  email: '',
  profession: '设计师/艺术从业者',
});

const professionColumns = [
  [
    { label: '学生', value: '学生' },
    { label: '计算机从业者', value: '计算机从业者' },
    { label: '设计师/艺术从业者', value: '设计师/艺术从业者' },
    { label: '医务人员', value: '医务人员' },
    { label: '自由职业者', value: '自由职业者' },
  ],
];

function onDatePopupChange(visible: boolean) {
  showDatePicker.value = visible;
}

function onProfessionPopupChange(visible: boolean) {
  showProfessionPicker.value = visible;
}

function onDateConfirm(value: any) {
  if (value) {
    formData.birthday = formatDate(value);
  }
  showDatePicker.value = false;
}

function onProfessionConfirm(value: any) {
  if (value && value[0]) {
    formData.profession = value[0];
  }
  showProfessionPicker.value = false;
}

/** 表单验证 */
function validateForm(): boolean {
  if (!formData.name || formData.name.trim().length < 2) {
    uni.showToast({ title: '请输入姓名（至少2个字符）', icon: 'none' });
    return false;
  }
  if (!formData.birthday) {
    uni.showToast({ title: '请选择生日', icon: 'none' });
    return false;
  }
  if (!formData.phone || !/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return false;
  }
  if (!formData.idCard || !/^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i.test(formData.idCard)) {
    uni.showToast({ title: '请输入正确的身份证号码', icon: 'none' });
    return false;
  }
  return true;
}

/** 确认保存 */
function handleConfirm() {
  if (!validateForm()) return;

  addPerson({
    name: formData.name,
    birthday: formData.birthday,
    phone: formData.phone,
    idCard: '',
    email: '',
    profession: formData.profession,
    isDefault: isDefault.value,
  });

  uni.navigateBack();
}
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";

.person-page {
  min-height: 100vh;
  background-color: @bg-color;
  padding-bottom: 160rpx;
}

.form-container {
  background-color: @bg-color-white;
}

.form-value {
  font-size: @font-size-small;
  color: @gy2;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background-color: @bg-color-white;
}
</style>
