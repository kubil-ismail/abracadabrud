import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from 'react-redux-loading-bar';

const useLoadingBar = (...loadings) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
  }, [loading]);

  useEffect(() => {
    if (loadings.some((l) => l)) {
      if (!loading) setLoading(true);
    } else if (loading) setLoading(false);
  }, [loadings]);
};

export default useLoadingBar;
