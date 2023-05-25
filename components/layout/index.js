import Navbar from '../navbar';
import MenuBar from '../navbar/MenuBar';
import Seo from 'components/seo/Seo';
import useAuthentication from 'core/hooks/useAuthentication';
import { useRouter } from 'next/router';
import EmptyVoteModal from 'components/empty-placeholder/EmptyVoteModal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPoint, resetPoint } from 'core/redux/reducers/pointSlice';
import SSServices from 'core/services/ServerSide/ssServices';
import { setMembershipsInfo } from 'core/redux/reducers/membershipsSlice';

export default function Layout(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { children } = props;
  const { token } = useSelector((state) => state.authentication);
  const [membershipStatus, setMembershipsStatus] = useState({});

  useAuthentication();

  useEffect(() => {
    if (token) {
      SSServices.getMembershipsStatus({
        token,
        client: true
      }).then((result) => {
        setMembershipsStatus(result);
        dispatch(setMembershipsInfo(result));
      });
    } else {
      dispatch(setMembershipsInfo([]));
    }
  }, [token, router]);

  useEffect(() => {
    if (props?.myPoints?.data) {
      dispatch(setPoint(props?.myPoints?.data));
    } else {
      dispatch(resetPoint());
    }
  }, [props]);

  return (
    <>
      <Seo />
      <div className="min-h-screen bg-[#1C1C1C] overflow-hidden ">
        <Navbar {...{ ...props, ...{ membershipStatus } }} />
        <div
          className=""
          style={{
            backgroundImage:
              router.pathname === '/sponsor' || router.pathname.startsWith('/user')
                ? `url('${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/bg-texture.webp')`
                : 'none',
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}>
          <div className="container px-4 pt-24 pb-32 md:max-w-[78rem] md:m-auto">{children}</div>
        </div>
        <MenuBar {...{ ...props, ...{ membershipStatus } }} />
        <EmptyVoteModal />
      </div>
    </>
  );
}
