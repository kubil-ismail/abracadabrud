export default function BannerUser({ data }) {
  return (
    <div className="container flex flex-col gap-8">
      <div className="">
        <img
          src={data?.user?.banner ?? '/assets/images/empty-banner.webp'}
          alt="banner"
          className="w-full h-40 md:h-[348px] object-cover object-center rounded-lg"
          onError={(e) => (e.target.src = '/assets/images/empty-banner.webp')}
          loading="lazy"
        />
      </div>
    </div>
  );
}
