"use client";
import { Detail } from '@/components/structure/organisms/Details/Details';
import React from 'react'
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useProductStore } from "@/lib/store";

export function ProductDetail(params: { id: string }) {
    const { product, fetchProduct } = useProductStore();
    const productId = params.id;
    const router = useRouter();

    React.useEffect(() => {
        if (productId) {
            fetchProduct(Number(productId));
        }
    }, [productId, fetchProduct]);

    const handleBack = () => {
        router.back();
    };
    const columnKey = ['tags', 'brand', 'dimensions', 'warrantyInformation', 'reviews', 'meta'] // for product details
    
    return (
        <div>
            <button onClick={handleBack} className="flex gap-2 p-4 hover:underline">
                <ArrowLeft /> Back
            </button>
            <Detail headingKey='title' subheadingKey='description' columnKey={columnKey} responseData={[product]} /> {/* make sure response data is an array */}
        </div>
    );
}