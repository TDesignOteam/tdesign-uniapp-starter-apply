import dayjs from 'dayjs';


/**
 * 将日期格式化为中文日期字符串
 * @param date 日期值
 * @returns 格式化后的日期字符串，例如：2024年3月15日
 */
export function formatDate(date: string | number | Date): string {
  if (!date) return '';
  return dayjs(date).format('YYYY年M月D日');
}

/**
 * 将日期格式化为标准日期格式
 * @param date 日期值
 * @returns 格式化后的日期字符串，例如：2024-03-15
 */
export function formatDateStandard(date: string | number | Date): string {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
}

/**
 * 判断日期是否已过期
 * @param date 日期值
 * @returns 是否已过期
 */
export function isExpired(date: string | number | Date): boolean {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs());
}

/**
 * 获取两个日期之间的天数差
 * @param start 开始日期
 * @param end 结束日期
 * @returns 天数差
 */
export function getDaysDiff(start: string | number | Date, end: string | number | Date): number {
  return dayjs(end).diff(dayjs(start), 'day');
}
