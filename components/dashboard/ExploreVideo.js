import CardVideo from '../element/CardVideo-v2';
import CardVideo3 from '../element/CardVideo-v3';

export default function ExploreVideo({version}) {
  return (
    <div className="flex flex-col space-y-12">{version === 3 ? <CardVideo3 /> : <CardVideo />}</div>
  );
}
