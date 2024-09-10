/** PropsWithClassName
 * Là một kiểu dữ liệu nhận vào một kiểu dữ liệu khác T
 * (hoặc là đối tượng rỗng {} nếu không có kiểu nào được cung cấp)
 * Và thêm thuộc tính tùy chọn className kiểu chuỗi vào đó.
 */
export type PropsWithClassName<T = {}> = T & { className?: string };
