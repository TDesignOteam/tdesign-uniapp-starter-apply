import request from '@/api/request';


export interface UserProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  avatar: string;
  city: string;
}

/** 获取用户资料 */
export function getUserProfile(): Promise<{data: UserProfile}> {
  return request('/user/profile');
}
