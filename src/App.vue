<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

import config from './config';
import { initMock } from './mock/index';

// 初始化 Mock 数据
if (config.isMock) {
  initMock();
}

onLaunch(() => {
  console.log('App Launch');

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
@import "@tdesign/uniapp/common/style/theme/index.less";

page {
  background-color: #f3f3f3;
}

.page {
  height: 100vh;
  background-color: #fff;
}
</style>
