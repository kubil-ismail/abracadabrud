import Layout from '../components/layout';

export const getBaseLayout = (page, props) => <Layout {...props}>{page}</Layout>;

const layouts = {
  base: getBaseLayout
};

export default function getLayouts(page, layout = 'base', props) {
  return layouts[layout](page, props);
}
