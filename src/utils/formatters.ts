/**
 * 格式化价格
 * @param minPrice 最低价格
 * @param maxPrice 最高价格
 * @returns 格式化后的价格字符串
 */
export function formatPrice(minPrice: number, maxPrice: number): string {
  if (minPrice === 0 && maxPrice === 0) return '免费';
  if (minPrice === maxPrice) return `¥${minPrice}`;
  return `¥${minPrice}-¥${maxPrice}`;
}
