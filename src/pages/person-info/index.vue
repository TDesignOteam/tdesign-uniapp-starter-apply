<template>
  <NavBar
    title="个人信息"
    :show-back="true"
  />
  <view class="person-page">
    <view class="form-container">
      <t-form
        ref="formRef"
        :data="formData"
        :rules="rules"
        label-align="left"
        show-error-message
        label-width="97px"
        required-mark
        required-mark-position="right"
      >
        <!-- 设为默认 -->
        <t-form-item
          label="设为默认"
          name="isDefault"
          content-align="right"
        >
          <t-switch v-model="isDefault" />
        </t-form-item>

        <!-- 姓名 -->
        <t-form-item
          label="姓名"
          name="name"
        >
          <t-input
            v-model:value="formData.name"
            placeholder="请输入姓名"
            borderless
            align="left"
            :maxlength="30"
          />
        </t-form-item>

        <!-- 生日 -->
        <t-form-item
          label="生日"
          name="birthday"
        >
          <view
            class="input-with-icon"
            @click="showDatePicker = true"
          >
            <t-input
              v-model:value="formData.birthday"
              placeholder="请选择生日"
              borderless
              align="left"
              readonly
            />
            <t-icon
              name="calendar"
              size="40rpx"
              class="calendar-icon"
              @click="showDatePicker = true"
            />
          </view>
        </t-form-item>

        <!-- 手机号 -->
        <t-form-item
          label="手机号"
          name="phone"
        >
          <t-input
            v-model:value="formData.phone"
            placeholder="请输入手机号"
            borderless
            align="left"
            :maxlength="11"
          />
        </t-form-item>

        <!-- 身份证 -->
        <t-form-item
          label="身份证"
          name="idCard"
        >
          <t-input
            v-model:value="formData.idCard"
            placeholder="请输入您的身份证号码"
            borderless
            align="left"
            :maxlength="18"
          />
        </t-form-item>

        <!-- 邮箱 -->
        <t-form-item
          label="邮箱"
          name="email"
        >
          <t-input
            v-model="formData.email"
            placeholder="请输入您的邮箱"
            borderless
            align="left"
            :maxlength="35"
          />
        </t-form-item>

        <!-- 职业 -->
        <t-form-item
          label="职业"
          name="profession"
          arrow
        >
          <t-input
            v-model:value="formData.profession"
            placeholder="请选择职业"
            borderless
            align="left"
            readonly
            @click="showProfessionPicker = true"
          />
        </t-form-item>
      </t-form>
    </view>

    <!-- 底部确认按钮 -->
    <view class="bottom-action">
      <t-button
        theme="primary"
        block
        size="large"
        @click="handleConfirm"
      >
        确定
      </t-button>
    </view>

    <t-date-time-picker
      :visible="showDatePicker"
      placement="bottom"
      :value="datePickerValue"
      title="选择生日"
      :mode="['date']"
      start="1950-01-01"
      end="2010-12-31"
      format="YYYY-MM-DD"
      @visible-change="onDatePopupChange"
      @confirm="onDateConfirm"
      @cancel="showDatePicker = false"
    />

    <t-picker
      :visible="showProfessionPicker"
      placement="bottom"
      :value="professionPickerValue"
      title="选择职业"
      cancel-btn="取消"
      confirm-btn="确认"
      @visible-change="onProfessionPopupChange"
      @confirm="onProfessionConfirm"
      @cancel="showProfessionPicker = false"
    >
      <t-picker-item :options="professionColumns" />
    </t-picker>

    <t-dialog ref="t-dialog" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

import { type TdFormProps } from '@tdesign/uniapp';

import NavBar from '@/components/nav-bar.vue';
import { addPerson } from '@/config/user-info';
import { formatDate } from '@/utils/date';

const formRef = ref<any>(null);
const isDefault = ref(false);
const showDatePicker = ref(false);
const showProfessionPicker = ref(false);
const datePickerValue = ref('1994-09-27');
const professionPickerValue = ref(['设计师/艺术从业者']);

// 表单数据
const formData = reactive({
  name: '蔡少宣',
  birthday: '1994年9月27日',
  phone: '18899998888',
  idCard: '',
  email: '',
  profession: '设计师/艺术从业者',
});

// 职业选项
const professionColumns = [
  { label: '学生', value: '学生' },
  { label: '计算机从业者', value: '计算机从业者' },
  { label: '设计师/艺术从业者', value: '设计师/艺术从业者' },
  { label: '医务人员', value: '医务人员' },
  { label: '自由职业者', value: '自由职业者' },
];

// 表单验证规则
const rules: TdFormProps['rules'] = {
  name: [
    { required: true, message: '请输入姓名' },
    {
      validator: (val: string) => {
        const len = val.trim().length;
        if (len < 2) {
          return { result: false, message: '姓名至少 2 个字符' };
        }
        return { result: true, message: '' };
      },
    },
  ],
  birthday: [
    { required: true, message: '请选择生日' },
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的电话号码' },
  ],
  idCard: [
    { required: true, message: '请输入身份证号码' },
    {
      pattern: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i,
      message: '请输入正确的身份证号码',
    },
  ],
  email: [
    {
      pattern: /^[a-z0-9][\w.-]*[a-z0-9]@[a-z0-9]+\.[a-z]+$/i,
      message: '请输入正确的邮箱',
    },
  ],
};

function onDatePopupChange({ visible }: { visible: boolean }) {
  showDatePicker.value = visible;
}

function onProfessionPopupChange({ visible }: { visible: boolean }) {
  showProfessionPicker.value = visible;
}

function onDateConfirm({ value }: any) {
  if (value) {
    formData.birthday = formatDate(value);
    datePickerValue.value = value;
  }
  showDatePicker.value = false;
}

function onProfessionConfirm({ value }:{value: any}) {
  console.log(value);
  if (value && value[0]) {
    formData.profession = value[0];
  }
  showProfessionPicker.value = false;
}

/** 判断验证结果是否通过 */
function isFormValid(validationResult: any): boolean {
  if (validationResult === true) return true;
  return Object.values(validationResult).every((rules: any) => Array.isArray(rules) && rules.every((rule: any) => rule.result === true));
}

/** 确认保存 */
async function handleConfirm() {
  if (!formRef.value) return;

  try {
    const result = await formRef.value.validate();

    if (isFormValid(result)) {
      // 添加到 userInfo store（由于 mock 数据会刷新重置，目前先保存在 store 里便于数据展示）
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
    } else {
      uni.showToast({
        title: '请完善表单内容',
        icon: 'none',
        duration: 2000,
      });
    }
  } catch {
    uni.showToast({
      title: '请完善表单内容',
      icon: 'none',
      duration: 2000,
    });
  }
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

  :deep(.t-form) {
    font-size: @font-size-default;

    .t-input__control::placeholder {
      color: @gy3;
    }

    .t-form-item__label--required {
      color: #e34d59;
      margin-left: 8rpx;
    }

    .t-form-item__controls {
      margin-top: 0;
    }

    .t-form-item__controls-content--right {
      justify-content: flex-end;
    }
  }
}

.input-with-icon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .calendar-icon {
    color: @gy3;
    flex-shrink: 0;
  }
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
