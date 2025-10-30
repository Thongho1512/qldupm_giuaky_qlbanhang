import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import productReducer from '@/features/product/productSlice';
import cartReducer from '@/features/cart/cartSlice';
import orderReducer from '@/features/order/orderSlice';
import categoryReducer from '@/features/category/categorySlice';
import userReducer from '@/features/user/userSlice';
import statisticsReducer from '@/features/statistics/statisticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    category: categoryReducer,
    user: userReducer,
    statistics: statisticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;