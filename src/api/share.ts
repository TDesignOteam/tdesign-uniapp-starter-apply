import request from '@/api/request';


export interface AppItem {
  id: string;
  name: string;
  icon: string;
}

export interface Person {
  id: string;
  name: string;
  avatar?: string;
  birthday?: string;
  phone?: string;
  idCard?: string;
  email?: string;
  profession?: string;
  isDefault: boolean;
}

/** 获取朋友列表 */
export function getFriendList(): Promise<Person[]> {
  return request('/share/friends');
}

/** 获取社交媒体应用列表 */
export function getAppList(): Promise<AppItem[]> {
  return request('/share/app');
}
