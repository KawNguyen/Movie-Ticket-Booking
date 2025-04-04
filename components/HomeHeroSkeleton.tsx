const HomeHeroSkeleton = () => {
  return (
    <div className="w-full md:h-screen relative animate-pulse">
      <div className="w-full h-full bg-gray-800" />
      <div className="absolute top-0 bg-gradient-to-r from-black w-[44%] h-full">
        <div className="absolute w-full h-full top-0 content-center xl:pl-20 pl-10">
          <div className="flex w-full flex-col space-y-4 pt-32">
            <div className="h-8 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-700 rounded w-4/6" />
            </div>
            <div className="h-10 bg-gray-700 rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeroSkeleton;
