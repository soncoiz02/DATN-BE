import { startOfToday } from 'date-fns';

const getVoucherDiscount = (count, percent, userId) => {
  const today = startOfToday(new Date());
  const next3Week = new Date(today);
  next3Week.setDate(next3Week.getDate() + 21);
  return {
    title: `Mã giảm giá ${percent}%`,
    description: `Bạn sẽ nhận được mã giảm giá này khi sử dụng dịch vụ ở spa ${count} lần`,
    discount: percent,
    startDate: today,
    endDate: new Date(next3Week),
    userId: userId.toString(),
    storeId: '636c753d5c0a9a137af97125',
  };
};

export default getVoucherDiscount;
