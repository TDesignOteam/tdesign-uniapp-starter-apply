import type { Person } from '@/api/share';


interface UserInfo {
  locationName: string;
  persons: Person[];
  selectedPersonIds: string[];
}

// 初始化人员数据
function initPersons(): Person[] {
  const storedPersons = uni.getStorageSync('userPersons');
  if (storedPersons) {
    return JSON.parse(storedPersons) as Person[];
  }
  // 默认添加一个人员
  return [
    {
      id: '1',
      name: '蔡宣轩',
      isDefault: true,
    },
  ];
}

// 初始化选中的人员ID
function initSelectedPersonIds(): string[] {
  const storedSelectedIds = uni.getStorageSync('userSelectedPersonIds');
  if (storedSelectedIds) {
    return JSON.parse(storedSelectedIds) as string[];
  }
  // 默认选中第一个人员
  return ['1'];
}

export const userInfoStore: UserInfo = {
  locationName: uni.getStorageSync('userLocationName') || '深圳市',
  persons: initPersons(),
  selectedPersonIds: initSelectedPersonIds(),
};

/** 添加人员 */
export function addPerson(person: Omit<Person, 'id'>) {
  const id = Date.now().toString();

  // 如果设置为默认，则将其他人员的默认状态设为false
  if (person.isDefault) {
    userInfoStore.persons.forEach((p) => {
      p.isDefault = false;
    });
  }

  userInfoStore.persons.push({
    id,
    ...person,
  });

  // 持久化
  uni.setStorageSync('userPersons', JSON.stringify(userInfoStore.persons));
}

/** 获取默认人员 */
export function getDefaultPerson(): Person | undefined {
  return userInfoStore.persons.find(p => p.isDefault);
}

/** 更新位置名称 */
export function updateLocationName(name: string) {
  userInfoStore.locationName = name;
  uni.setStorageSync('userLocationName', name);
}

/** 更新选中的人员ID */
export function updateSelectedPersonIds(ids: string[]) {
  userInfoStore.selectedPersonIds = ids;
  uni.setStorageSync('userSelectedPersonIds', JSON.stringify(ids));
}
