import { eventApi } from 'core/services/rtk/EventServices';
import { authenticationApi } from 'core/services/rtk/AuthenticationServices';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { resetPayment } from 'core/redux/reducers/paymentsSlice';
import { setModal } from 'core/redux/reducers/modalSlice';
import { pointApi } from 'core/services/rtk/MeServices';
import { membershipApi } from 'core/services/rtk/MembershipServices';
import nookies from 'nookies';

const useAuthentication = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated, token } = useSelector((state) => state.authentication);
    const list_auth = [
        '/checkout',
        '/checkout/order-summary/[data]',
        '/uploads',
        '/my-account',
        '/premium-access',
    ]

    useEffect(() => {
        if (!isAuthenticated) {
            if (list_auth.includes(router.pathname)) {
                router.push('/');
                dispatch(setModal({ name: 'modalLogin', value: true }));
            }
            dispatch(resetPayment());
            dispatch(authenticationApi.util.resetApiState());
            // dispatch(eventApi.util.invalidateTags([{ type: 'isFavorite' }, { type: 'Favorite' }, { type: 'Vote' }, { type: 'Comment' }]))

            // Remove token from cookie
            nookies.set(null, 'token', '', {
                path: '/',
                maxAge: 0,
            });
        }
        if (isAuthenticated) {
            dispatch(eventApi.util.invalidateTags([
                'isFavorite',
                'Favorite',
                'Vote',
                'Comment',
                'ActiveMemberships',
                'PaymentMembership',
            ]))
            dispatch(pointApi.util.invalidateTags([
                'Points',
                'Vote'
            ]))
            dispatch(authenticationApi.util.invalidateTags(['Me']))

            // Save token to cookie
            nookies.set(null, 'token', token, {
                path: '/',
                maxAge: 30 * 24 * 60 * 60,
            });

        }
    }, [isAuthenticated]);

    // const {
    //     isSucces,
    //     isError,
    // } = useCheckTokenStatusQuery({}, {
    //     refetchOnMountOrArgChange: true,
    //     refetchOnReconnect: true,
    //     refetchOnWindowFocus: true,
    //     skip: !isAuthenticated,
    // })

    const logout = () => {
        dispatch(authenticationApi.util.resetApiState());
        dispatch(eventApi.util.resetApiState());
        router.push('/');
    };

    // useEffect(() => {
    //     if (isError) {
    //         nookies.destroy(null, 'token');
    //         logout()
    //     }
    // }, [isError])

    return { logout };
}

export default useAuthentication;