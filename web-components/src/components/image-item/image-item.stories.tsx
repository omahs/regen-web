import ImageItem from '.';

export default {
  title: 'Image Item',
  component: ImageItem,
};

const titleText = 'Verified outcomes';
const descriptionText =
  'Software-based and remote-sensing monitoring keeps costs low and transparency high.';

export const imageItem = (): JSX.Element => (
  <ImageItem
    img={<img src="./verified.png" alt="verified" />}
    title={titleText}
    description={descriptionText}
  />
);
