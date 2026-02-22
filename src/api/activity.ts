import request from '@/api/request';


export interface ActivityFilterParams {
  domain: string[];
  type: string[];
  minPrice: number;
  maxPrice: number;
  dateRange: Date[];
}

export type SortOption = 'latest' | 'top';

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: SortOption;
}

/** 获取首页活动列表 */
export function getActivities(params: ActivityFilterParams & PaginationParams) {
  return request('/activities', 'POST', { params });
}

/** 获取首页轮播图 */
export function getHomeSwiper() {
  return request('/homeSwiper');
}

export type ActivityStatus = '待参加' | '已完成';

interface PersonActivityParams {
  personId?: string;
  status?: ActivityStatus;
  date?: Date;
}

export interface PersonActivityItem {
  id: string;
  personId: string;
  title: string;
  status: ActivityStatus;
  date: string | number | Date;
  cover: string;
}

export interface PersonActivitiesResponse {
  data: PersonActivityItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/** 获取个人活动列表 */
export function getPersonActivities(params: PaginationParams & PersonActivityParams): Promise<PersonActivitiesResponse> {
  return request('/personActivities', 'GET', params);
}

// ==== 详情页类型 ====
export interface ActivityComment {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  content: string;
}

export interface ActivityInterestedPerson {
  id: string;
  name: string;
  avatar: string;
}

export interface ActivityDetail {
  id: string;
  title: string;
  cover: string;
  banner?: string;
  guestImages?: string[];
  sceneImages?: string[];
  score: number;
  minPrice: number;
  maxPrice: number;
  date: string | Date;
  domain: string[];
  type: string;
  address: string;
  introduce: string;
  interestedCount?: number;
  comments?: ActivityComment[];
  interestedPeople?: ActivityInterestedPerson[];
}

export interface TicketItem {
  id: string;
  activityId: string;
  date: string;
}

export interface PriceItem {
  id: string;
  activityId: string;
  description: string;
  price: number;
  originalPrice: number;
  person: number;
}

/** 获取活动详情 */
export function getActivityDetail(id: string): Promise<ActivityDetail> {
  return request(`/activities/${id}`);
}

/** 获取活动票类场次 */
export function getActivityTickets(id: string): Promise<TicketItem[]> {
  return request(`/activities/${id}/tickets`);
}

/** 获取活动票档价格 */
export function getActivityPrices(id: string): Promise<PriceItem[]> {
  return request(`/activities/${id}/prices`);
}
