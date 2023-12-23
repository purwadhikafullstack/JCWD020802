import { Typography } from "@material-tailwind/react";

export function ProductCategories() {
    const categoryLists = [
        {
            name: "Table",
            picture: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg",
        },
        {
            name: "Chair",
            picture: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
        },
        {
            name: "Bed",
            picture: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
        },
        {
            name: "Wardrobe",
            picture: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg"
        },
        {
            name: "Sofa",
            picture: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg"
        },
        {
            name: "Bookshelf",
            picture: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg"
        },
    ];

    return (
        <div>
            <div class="flex items-center justify-center py-4 md:py-8 flex-wrap">
                <button type="button" class="text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800">All categories</button>
                {categoryLists.map((item) => (
                    <button type="button" class="text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800">
                        {item.name}
                    </button>
                ))}
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categoryLists.map((item) => (
                    <div className="relative w-full">
                        <img class="h-auto max-w-full rounded-lg" src={item.picture} alt="" />
                        <figcaption className="absolute bottom-3 w-3/4 justify-between rounded-r-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                            <Typography variant="h5" color="blue-gray">
                                {item.name}
                            </Typography>
                        </figcaption>
                    </div>
                ))}
            </div>
        </div>
    )
}