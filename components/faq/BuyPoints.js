import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setModal } from 'core/redux/reducers/modalSlice';
import { toast } from 'react-toastify';
import { setPaymentFor, setPointsFee, setPointsId } from 'core/redux/reducers/paymentsSlice';
import { useEffect } from 'react';

export default function BuyPoints(props) {
    const { isAuthenticated, token } = useSelector((state) => state.authentication);
    const { t } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();
    const price = props?.bottomConfig?.allEvents?.buy_points?.price ?? 0;
    const can_buy_points = props?.bottomConfig?.membershipStatus?.can_buy_points ?? false;

    useEffect(() => {
        if (props?.bottomConfig?.allEvents?.buy_points?.price) {
            // dispatch(setPointsId(props?.bottomConfig?.allEvents?.buy_points?.id)); // not used yet?
            dispatch(setPointsFee(price));
        }
    }, [price]);

    const checkoutPoints = () => {
        // harus login
        if (!isAuthenticated || !token) {
            dispatch(setModal({ name: 'modalLogin', value: true }));
            return;
        }

        // harus ada event ongoing
        if (props?.bottomConfig?.allEvents?.data?.data?.length === 0) {
            toast.error(t('There is no event'));
            return;
        }

        // harus sudah membership
        if (props?.bottomConfig?.membershipStatus?.memberships?.length === 0) {
            toast.error(t('Please upgrade your membership first'));
            return;
        }

        // harus belum beli points di minggu ini
        if (!can_buy_points) {
            toast.error(t('You already bought points for this week, please try again next week'));
            return;
        }
        dispatch(setPaymentFor('points'));
        router.push('/checkout');
    };
    return (
        <div className="flex flex-col space-y-5" id="buy-points">
            <button className="bg-[#FF00FE] text-white rounded-[20px] py-3 px-5 font-bold text-xl disabled:opacity-50"
                onClick={checkoutPoints}
                disabled={!can_buy_points}
            >
                {t('Buy Points (testing)')}
            </button>
        </div>
    );
}
