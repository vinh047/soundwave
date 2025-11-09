/**
 * Kiểm tra định dạng email cơ bản.
 * @param email Chuỗi email cần kiểm tra.
 * @returns true nếu email hợp lệ.
 */
export const isValidEmail = (email: string): boolean => {
  // Regex kiểm tra định dạng chuẩn: user@domain.tld
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
