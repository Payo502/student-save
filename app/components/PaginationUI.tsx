"use client"

import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {useRouter, useSearchParams} from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    isSearchPagination?: boolean;
}

const PaginationUI: React.FC<PaginationProps> = ({currentPage, totalPages, isSearchPagination = false}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const currentQuery = searchParams.get("query") || "";
            const searchPage = searchParams.get("searchPage") || 1;
            const dealsPage = searchParams.get("dealsPage") || 1;

            const queryParams = new URLSearchParams({
                query: currentQuery,
                dealsPage: isSearchPagination ? dealsPage.toString() : newPage.toString(),
                searchPage: isSearchPagination ? newPage.toString() : searchPage.toString(),
            });

            if(!currentQuery) queryParams.delete("query");

            router.push(`?${queryParams.toString()}`)

        }
    }

    return (
        <Stack spacing={2} className="flex justify-center mt-8">
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
                size="large"
                color={"standard"}
            />
        </Stack>
    );
}


export default PaginationUI;