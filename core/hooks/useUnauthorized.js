import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { authenticationApi, useMeQuery } from '../services/rtk/AuthenticationServices';
import { logout } from '../redux/reducers/authenticationSlice';
import { toast } from 'react-toastify';

export default function useUnauthorized() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.authentication);

  // get error state from authenticationApi
  const { error, isError, refetch } = useMeQuery(
    {},
    {
      skip:
        router.route === '/my-account' ||
          router.route === '/uploads' ||
          router.route === '/checkout' ||
          router.route === '/id/my-account' ||
          router.route === '/id/uploads' ||
          router.route === '/id/checkout' &&
          isAuthenticated === false
          ? false
          : true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true
    }
  );

  // useEffect(() => {
  //   if (isAuthenticated && token) {
  //     refetch();
  //   }
  // }, [isAuthenticated, token]);

  useEffect(() => {
    // if in route name is my-account, uploads, checkout
    if (error) {
      // if error 401, logout
      if (error.status === 401) {
        dispatch(authenticationApi.util.resetApiState());
        // redirect to home
        router.push('/');
        dispatch(logout());
        toast.error('Your session has expired. Please login again.');
      }

      // if error 403, redirect to 403 page
      if (error.status === 403) {
        router.push('/403');
      }

      // if error 404, redirect to 404 page
      if (error.status === 404) {
        router.push('/404');
      }

      // if error 500, redirect to 500 page
      if (error.status === 500) {
        router.push('/500');
      }
    }
  }, [isError]);
}
