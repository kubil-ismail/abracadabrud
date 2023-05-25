import EmptyPodium from 'components/empty-placeholder/EmptyPodium';

export default function SkeletonPodium({ loading }) {
    return (
        <>
            {loading ? (
                <>
                    <div className="flex justify-between space-x-3 w-full">
                        <div className="flex-0">
                            <h3 className="h-8 bg-gray-200 rounded-full w-10 animate-pulse"></h3>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-full w-full animate-pulse">
                        </div>
                        <div className="flex-0">
                            <h3 className="h-8 bg-gray-200 rounded-full w-10 animate-pulse"></h3>
                        </div>
                    </div>
                    <div className="flex justify-between space-x-3 w-full">
                        <div className="flex-0">
                            <h3 className="h-8 bg-gray-200 rounded-full w-10 animate-pulse"></h3>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-full w-full">
                        </div>
                        <div className="flex-0">
                            <h3 className="h-8 bg-gray-300 rounded-full w-10 animate-pulse"></h3>
                        </div>
                    </div>
                    <div className="flex justify-between space-x-3 w-full">
                        <div className="flex-0">
                            <h3 className="h-8 bg-gray-200 rounded-full w-10 animate-pulse"></h3>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-full w-full">
                        </div>
                        <div className="flex-0">
                            <h3 className="h-8 bg-gray-200 rounded-full w-10"></h3>
                        </div>
                    </div>
                    <div className="flex justify-between space-x-3 w-full">
                        <div className="flex-0">
                            <h3 className="h-8 bg-gray-200 rounded-full w-10"></h3>
                        </div>
                        <div className="h-8 bg-gray-200 rounded-full w-full">
                        </div>
                        <div className="flex-0">
                            <h3 className="h-8 bg-gray-200 rounded-full w-10"></h3>
                        </div>
                    </div>
                </>
            ) : (
                <EmptyPodium />
            )}
        </>
    );
}
