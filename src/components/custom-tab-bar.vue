<template>
  <t-tab-bar
    fixed
    placeholder
    :value="value"
    theme="tag"
    :split="false"
    @change="handleChange"
  >
    <t-tab-bar-item
      icon="home"
      value="base"
    >
      首页
    </t-tab-bar-item>
    <t-tab-bar-item
      icon="user"
      value="user"
    >
      我的
    </t-tab-bar-item>
  </t-tab-bar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const value = ref('');

// 获取当前页面对应的 tab 值
const getCurrentTabValue = () => {
  const pages = getCurrentPages();
  const curPage = pages[pages.length - 1];
  if (curPage) {
    const route = (curPage as any).route || '';
    const nameRe = /pages\/main\/(\w+)\/index/.exec(route);
    if (nameRe && nameRe[1]) {
      return nameRe[1];
    }
  }
  return '';
};

// 同步状态
const syncState = () => {
  value.value = getCurrentTabValue();
};

onMounted(() => {
  syncState();
});

const handleChange = (e: any) => {
  const val = e?.value;
  // 如果点击的是当前页面，不做任何操作
  if (val === value.value) {
    return;
  }

  // 使用 redirectTo 切换页面
  uni.redirectTo({
    url: `/pages/main/${val}/index`,
  });
};
</script>

<style lang="less" scoped>
@import "@/styles/variable.less";
</style>
