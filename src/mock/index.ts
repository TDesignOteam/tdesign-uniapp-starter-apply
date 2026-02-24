// Mock 数据存储
const mockStore: Record<string, any> = {};

const ACTIVITY_DETAIL_1 =  {
  id: '1',
  title: '2024深圳设计周',
  cover: '/static/activity/cover1.png',
  banner: '/static/activity/banner1.png',
  guestImages: ['/static/mock-imgs/activity/guests1.png', '/static/mock-imgs/activity/guests2.png'],
  sceneImages: ['/static/mock-imgs/activity/location1.png', '/static/mock-imgs/activity/location2.png'],
  score: 4.5,
  minPrice: 0,
  maxPrice: 0,
  date: '2225-06-15',
  domain: ['设计'],
  type: '展览',
  address: '深圳会展中心 1号馆',
  introduce: '深圳设计周是深圳市年度大型设计活动，汇集国内外知名设计师和设计机构。本届设计周以"设计赋能城市"为主题，展出包括工业设计、建筑设计、平面设计等多个领域的优秀作品，为参与者提供灵感碰撞和跨界交流的平台。',
  interestedCount: 1200,
  interestedPeople: [
    { id: '1', name: '设计师小王', avatar: '/static/avatar.jpeg' },
    { id: '2', name: '创意达人', avatar: '/static/avatar.jpeg' },
    { id: '3', name: '艺术家老李', avatar: '/static/avatar.jpeg' },
    { id: '4', name: '产品经理', avatar: '/static/avatar.jpeg' },
    { id: '5', name: '视觉设计师', avatar: '/static/avatar.jpeg' },
    { id: '6', name: 'UI小姐姐', avatar: '/static/avatar.jpeg' },
  ],
  comments: [
    { id: 'c1', user: '设计爱好者', avatar: '/static/avatar.jpeg', rating: 5, content: '展览规模宏大，作品质量很高，特别是工业设计展区让人大开眼界。' },
    { id: 'c2', user: '创意总监', avatar: '/static/avatar.jpeg', rating: 4, content: '每年必来的设计周，今年的互动体验区做得比以往更好了！' },
    { id: 'c3', user: '平面设计师', avatar: '/static/avatar.jpeg', rating: 4.5, content: '认识了很多同行，交流收获很大，期待明年的活动。' },
  ],
};
const ACTIVITY_DETAIL_2 =  {
  id: '2',
  title: 'Vue Conf 2024 技术大会',
  cover: '/static/activity/cover2.png',
  banner: '/static/activity/banner2.png',
  guestImages: ['/static/mock-imgs/activity/guests1.png', '/static/mock-imgs/activity/guests2.png'],
  sceneImages: ['/static/mock-imgs/activity/location1.png', '/static/mock-imgs/activity/location2.png'],
  score: 4.8,
  minPrice: 199,
  maxPrice: 599,
  date: '2025-07-20',
  domain: ['技术'],
  type: '大会',
  address: '深圳南山科技园 会议中心',
  introduce: 'Vue Conf 技术大会，邀请 Vue.js 核心团队成员分享最新技术动态和最佳实践。大会涵盖 Vue 3 组合式 API、Vite 工具链、SSR 方案、状态管理等前沿话题，是前端开发者不可错过的年度盛会。',
  interestedCount: 800,
  interestedPeople: [
    { id: '1', name: '开发者A', avatar: '/static/avatar.jpeg' },
    { id: '2', name: '开发者B', avatar: '/static/avatar.jpeg' },
    { id: '3', name: '开发者C', avatar: '/static/avatar.jpeg' },
    { id: '4', name: '开发者D', avatar: '/static/avatar.jpeg' },
  ],
  comments: [
    { id: 'c1', user: '前端小哥', avatar: '/static/avatar.jpeg', rating: 5, content: '干货满满！尤其是 Vue 3 性能优化部分，学到了很多实用技巧。' },
    { id: 'c2', user: 'JS爱好者', avatar: '/static/avatar.jpeg', rating: 4.5, content: '讲师阵容强大，内容紧凑丰富，唯一遗憾是时间太短了。' },
  ],
};

// 初始化 Mock 数据
export function initMock() {
  // 首页轮播图
  mockStore['/homeSwiper'] = {
    code: 200,
    data: [
      {
        id: '1',
        name: '2019 SICC服务设计创新大会',
        url: '/static/mock-imgs/activity/sicc2019.png',
      },
      {
        id: '2',
        name: '2021 SICC服务设计创新大会',
        url: '/static/mock-imgs/activity/sicc2021.png',
      },
      {
        id: '3',
        name: '第一届SICC服务创新大会',
        url: '/static/mock-imgs/activity/sicc2019.png',
      },
      {
        id: '4',
        name: '第三届SICC服务创新大会',
        url: '/static/mock-imgs/activity/sicc2021.png',
      },
      {
        id: '5',
        name: '2019年SICC服务设计创新大会',
        url: '/static/mock-imgs/activity/sicc2019.png',
      },
      {
        id: '6',
        name: '2021年SICC服务设计创新大会',
        url: '/static/mock-imgs/activity/sicc2021.png',
      },
    ],
  };

  // 活动列表
  mockStore['/activities'] = {
    code: 200,
    data: {
      paginatedData: [
        {
          id: '1',
          title: '2024深圳设计周',
          cover: '/static/activity/cover1.png',
          score: 4.5,
          minPrice: 0,
          maxPrice: 0,
          date: '2025-06-15',
          domain: ['设计'],
          type: '展览',
          address: '深圳会展中心',
        },
        {
          id: '2',
          title: 'Vue Conf 2024 技术大会',
          cover: '/static/activity/cover2.png',
          score: 4.8,
          minPrice: 199,
          maxPrice: 599,
          date: '2025-07-20',
          domain: ['技术'],
          type: '大会',
          address: '深圳南山科技园',
        },
        {
          id: '3',
          title: '户外音乐节',
          cover: '/static/activity/cover3.png',
          score: 4.2,
          minPrice: 280,
          maxPrice: 880,
          date: '2025-08-10',
          domain: ['音乐'],
          type: '音乐节',
          address: '深圳湾公园',
        },
        {
          id: '4',
          title: '亲子艺术工作坊',
          cover: '/static/activity/cover1.png',
          score: 4.6,
          minPrice: 128,
          maxPrice: 328,
          date: '2025-09-01',
          domain: ['艺术'],
          type: '工作坊',
          address: '深圳美术馆',
        },
      ],
    },
  };

  // 活动详情
  mockStore['/activities/1'] = {
    code: 200,
    data: {
      ...ACTIVITY_DETAIL_1,
      id: '1',
    },
  };

  mockStore['/activities/2'] = {
    code: 200,
    data: {
      ...ACTIVITY_DETAIL_2,
      id: '2',
    },
  };

  mockStore['/activities/3'] = {
    code: 200,
    data: {
      ...ACTIVITY_DETAIL_1,
      id: '3',
    },
  };

  mockStore['/activities/4'] = {
    code: 200,
    data: {
      ...ACTIVITY_DETAIL_2,
      id: '4',
    },
  };

  // 活动票类场次
  mockStore['/activities/1/tickets'] = {
    code: 200,
    data: [
      { id: 't1', activityId: '1', date: '6月15日 上午场 10:00-12:00' },
      { id: 't2', activityId: '1', date: '6月15日 下午场 14:00-17:00' },
      { id: 't3', activityId: '1', date: '6月16日 全天场 10:00-17:00' },
    ],
  };

  mockStore['/activities/2/tickets'] = {
    code: 200,
    data: [
      { id: 't1', activityId: '2', date: '7月20日 全天 09:00-18:00' },
      { id: 't2', activityId: '2', date: '7月21日 全天 09:00-18:00' },
    ],
  };

  // 活动票档价格
  mockStore['/activities/1/prices'] = {
    code: 200,
    data: [
      { id: 'p1', activityId: '1', description: '免费票', price: 0, originalPrice: 0, person: 1 },
    ],
  };

  mockStore['/activities/2/prices'] = {
    code: 200,
    data: [
      { id: 'p1', activityId: '2', description: '普通票 - 单人', price: 199, originalPrice: 299, person: 1 },
      { id: 'p2', activityId: '2', description: 'VIP票 - 单人', price: 599, originalPrice: 799, person: 1 },
      { id: 'p3', activityId: '2', description: '双人优惠票', price: 350, originalPrice: 598, person: 2 },
    ],
  };

  // 个人活动列表
  mockStore['/personActivities'] = {
    code: 200,
    data: [
      {
        id: '1',
        personId: '1',
        title: '2024深圳设计周',
        status: '待参加',
        date: '2025-06-15',
        cover: '/static/activity/cover1.png',
      },
      {
        id: '2',
        personId: '1',
        title: 'Vue Conf 2024 技术大会',
        status: '待参加',
        date: '2025-07-20',
        cover: '/static/activity/cover2.png',
      },
      {
        id: '3',
        personId: '1',
        title: '春季户外音乐节',
        status: '已完成',
        date: '2024-04-10',
        cover: '/static/activity/cover3.png',
      },
      {
        id: '4',
        personId: '1',
        title: '秋季户外音乐节',
        status: '已完成',
        date: '2024-04-10',
        cover: '/static/activity/cover3.png',
      },
    ],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 3,
      totalPages: 1,
    },
    // },
  };

  // 用户资料
  mockStore['/user/profile'] = {
    code: 200,
    data: {
      id: '1',
      name: 'TDesign',
      age: 29,
      occupation: '设计师',
      avatar: '/static/avatar.jpeg',
      city: '深圳',
    },
  };

  // 分享 - 朋友列表
  mockStore['/share/friends'] = {
    code: 200,
    data: [
      { id: '1', name: '小明', avatar: '/static/avatar.jpeg', isDefault: false },
      { id: '2', name: '小红', avatar: '/static/avatar.jpeg', isDefault: false },
      { id: '3', name: '小王', avatar: '/static/avatar.jpeg', isDefault: false },
    ],
  };

  // 分享 - 应用列表
  mockStore['/share/app'] = {
    code: 200,
    data: [
      { id: '1', name: '微信', icon: '/static/icon_wx.png' },
      { id: '2', name: 'QQ', icon: '/static/icon_qq.png' },
    ],
  };

  // 城市列表
  mockStore['/cities'] = {
    code: 200,
    data: [
      {
        index: 'A',
        children: [
          { name: '安庆', label: '安庆' },
          { name: '安阳', label: '安阳' },
        ],
      },
      {
        index: 'B',
        children: [
          { name: '北京', label: '北京' },
          { name: '保定', label: '保定' },
        ],
      },
      {
        index: 'C',
        children: [
          { name: '长沙', label: '长沙' },
          { name: '成都', label: '成都' },
          { name: '重庆', label: '重庆' },
        ],
      },
      {
        index: 'G',
        children: [
          { name: '广州', label: '广州' },
          { name: '贵阳', label: '贵阳' },
        ],
      },
      {
        index: 'H',
        children: [
          { name: '杭州', label: '杭州' },
          { name: '合肥', label: '合肥' },
          { name: '海口', label: '海口' },
        ],
      },
      {
        index: 'N',
        children: [
          { name: '南京', label: '南京' },
          { name: '南昌', label: '南昌' },
        ],
      },
      {
        index: 'S',
        children: [
          { name: '上海', label: '上海' },
          { name: '深圳', label: '深圳' },
          { name: '苏州', label: '苏州' },
        ],
      },
      {
        index: 'W',
        children: [
          { name: '武汉', label: '武汉' },
          { name: '无锡', label: '无锡' },
        ],
      },
      {
        index: 'X',
        children: [
          { name: '西安', label: '西安' },
          { name: '厦门', label: '厦门' },
        ],
      },
      {
        index: 'Z',
        children: [
          { name: '郑州', label: '郑州' },
          { name: '珠海', label: '珠海' },
        ],
      },
    ],
  };

  // 拦截 uni.request
  const originalRequest = uni.request;
  // @ts-ignore
  uni.request = function (options: UniApp.RequestOptions) {
    const url = options.url || '';

    // 检查是否有对应的 mock 数据
    for (const key of Object.keys(mockStore)) {
      if (url.endsWith(key)) {
        const mockData = mockStore[key];
        setTimeout(() => {
          if (options.success) {
            const res: UniApp.RequestSuccessCallbackResult = {
              data: mockData,
              statusCode: 200,
              header: {},
              cookies: [],
              errMsg: 'request:ok',
            };
            options.success(res);
          }
          if (options.complete) {
            options.complete({} as any);
          }
        }, 300);
        const task: UniApp.RequestTask = {
          abort: () => {},
          onHeadersReceived: () => {},
          offHeadersReceived: () => {},
        };
        return task;
      }
    }

    // 如果没有 mock 数据，调用原始请求
    return originalRequest(options);
  };
}

export default { initMock };
