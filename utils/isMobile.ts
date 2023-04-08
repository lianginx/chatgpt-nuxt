/**
 * 判断是否为移动设备
 * @returns {Boolean} 返回布尔值表示是否为移动设备
 */
export const isMobile = (): boolean =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
