import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface Props {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  itemsCount: number;
  itemsPerPage?: number;
  refetch?: () => void;
}

const Paginator = ({ page, setPage, itemsCount, itemsPerPage=10, refetch }: Props) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  const maxVisiblePages = 10;

  // Calculate dynamic page range based on current page
  const getVisiblePages = () => {
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    itemsCount > 0 && (
      <div className='flex items-center justify-center px-4 py-3 sm:px-6 gap-10 mt-10'>
        <p className='text-sm text-gray-500'>{`${page} de ${totalPages}`}</p>
        <button
          type='button'
          className='cursor-pointer text-gray-500 hover:text-gray-700'
          onClick={() => {
            setPage(prev => Math.max(1, prev - 1))
            refetch?.()
          }}
          disabled={page === 1}
        >
          <ArrowBigLeft />
        </button>

        <div>
          {visiblePages.map(p => (
            <button
              type='button'
              key={p}
              onClick={() => setPage(p)}
              className={`mx-1 cursor-pointer rounded-md transition duration-300 border border-gray-300 ${
                page === p
                  ? 'bg-blue-600 text-slate-50 hover:bg-blue-500'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } px-4 py-2 text-sm font-medium`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type='button'
          className='cursor-pointer text-gray-500 hover:text-gray-700'
          onClick={() => {
            setPage(prev => Math.min(totalPages, prev + 1))
            refetch?.()
          }}
          disabled={page === totalPages}
        >
          <ArrowBigRight />
        </button>
      </div>
    )
  );
}

export default Paginator