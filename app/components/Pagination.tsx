"use client";

import React from 'react';
import {useRouter} from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages}) => {
    const router = useRouter();

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            router.push(`?page=${newPage}`);
        }
    };

    return (
        <div className="flex justify-center mt-8">
            <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="mx-2 px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
            >
                Previous
            </button>
            <span className="mx-2">Page {currentPage}</span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="mx-2 px-4 py-2 bg-primary text-white rounded"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;

