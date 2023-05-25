import { useGetSeoQuery } from 'core/services/rtk/GlobalServices';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GlobalServices from '../../core/services/GlobalServices';
import SSServices from '../../core/services/ServerSide/ssServices';
import { NextSeo } from 'next-seo';

function Seo() {
  const { asPath } = useRouter();
  const [seo, setSeo] = useState(null);

  // const clientSideSeo = async () => {
  //     const clientSideSeo = await GlobalServices.getSeo({ path: asPath });
  //     if (clientSideSeo) {
  //         setSeo(clientSideSeo);
  //     }
  //     return clientSideSeo;
  // };

  // useEffect(() => {
  //     clientSideSeo();
  // }, [asPath]);

  const { data: dataSeo, isSuccess } = useGetSeoQuery(
    { path: asPath },
    {
      refetchOnMountOrArgChange: true
    }
  );

  useEffect(() => {
    if (isSuccess) {
      setSeo(dataSeo?.data);
    }
  }, [dataSeo, isSuccess]);

  return (
    <>
      <NextSeo
        // title={dataSeo?.data?.title}
        description={dataSeo?.data?.description}
        image={dataSeo?.data?.image}
        keywords={dataSeo?.data?.keywords}
        additionalMetaTags={[
          {
            ...dataSeo?.data
          }
        ]}
      />
    </>
  );
}

export const getAyncSeo = async (context, defaultSeo = {}) => {
  const { asPath } = context;

  const seo = await SSServices.getSeo({ path: asPath });

  return { seo: seo || defaultSeo };
};

export default Seo;
