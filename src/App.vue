<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';


import config from './config';
import { initMock } from './mock/index';

import { useTheme } from '@/composables/use-theme';

// 初始化 Mock 数据
if (config.isMock) {
  initMock();
}

// 初始化主题（绑定系统主题监听 + 同步导航栏颜色等）
const { applyTheme } = useTheme();

onLaunch(() => {
  console.log('App Launch');

  // 应用当前主题（同步导航栏颜色等）
  applyTheme();

  // #ifdef MP-WEIXIN
  const updateManager = uni.getUpdateManager();
  updateManager.onCheckForUpdate(() => {
  });
  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {
          updateManager.applyUpdate();
        }
      },
    });
  });
  // #endif
});

onShow(() => {
  console.log('App Show');
});

onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="less">
@import "@tdesign/uniapp/theme.less";

/* #ifdef H5 */
:root,
/* #endif */
page,
.page {
  --navbar-height: 48px;
  --tabbar-height: 56px;
  --status-bar-height: -46px;
  --swiper-height: 159.2px;
  --swiper-width: 283px;
  --card-height: 120px;
  --footer-height: 80px;

  --bg-color-page: var(--td-bg-color-container, #ffffff);
  --bg-color-secondarypage: var(--td-bg-color-secondarycontainer, #f5f6f7);
  --bg-color-black-colorful: #040000; // 五彩斑斓的黑
}
</style>
