import dayjs from 'dayjs';

import type { ManipulateType } from 'dayjs';


/**
 * 生成日期范围：从过去N个单位到未来N个单位
 * @param pastCount 过去的数量，默认1
 * @param futureCount 未来的数量，默认6
 * @param pastUnit 过去的单位，默认 'week'
 * @param futureUnit 未来的单位，默认 'month'
 * @returns [startDate, endDate] 格式的日期数组
 */
export function generateDateRange(
  pastCount = 1,
  futureCount = 6,
  pastUnit: ManipulateType = 'week',
  futureUnit: ManipulateType = 'month',
): [Date, Date] {
  const startDate = dayjs().subtract(pastCount, pastUnit)
    .toDate();
  const endDate = dayjs().add(futureCount, futureUnit)
    .toDate();
  return [startDate, endDate];
}

/**
 * 格式化日期范围为中文格式
 * @param dateRange 日期范围数组
 * @returns 格式化后的日期范围字符串
 */
export function formatDateRange(dateRange: Date[]): string {
  if (dateRange.length === 0) return '';
  if (dateRange.length === 1) {
    return formatDate(dateRange[0]);
  }

  const [startDate, endDate] = dateRange;
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const startDay = startDate.getDate();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;
  const endDay = endDate.getDate();

  if (startYear === endYear) {
    return `${startYear}年${startMonth}月${startDay}日-${endMonth}月${endDay}日`;
  }
  return `${startYear}年${startMonth}月${startDay}日-${endYear}年${endMonth}月${endDay}日`;
}

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
