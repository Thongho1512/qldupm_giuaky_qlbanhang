import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store, RootState, AppDispatch } from './store/store';
import AppRoutes from './routes';
import { syncCartWithUser } from './features/cart/cartSlice';

// ✅ Component để sync cart khi login/logout
function CartSyncHandler() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Sync cart với userId mỗi khi auth state thay đổi
    const userId = isAuthenticated && user ? user.id : null;
    dispatch(syncCartWithUser({ userId }));
  }, [dispatch, isAuthenticated, user]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <CartSyncHandler />
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#363636',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
              duration: 2000,
            },
          }}
          containerStyle={{
            top: 80,
          }}
          gutter={8}
        />
      </BrowserRouter>
    </Provider>
  );
}

export default App;