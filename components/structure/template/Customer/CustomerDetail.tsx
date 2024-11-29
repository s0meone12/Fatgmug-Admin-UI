"use client";
import { Detail } from '@/components/structure/organisms/Details/Details';
import React from 'react'
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCustomerStore } from "@/lib/store";

export function CustomerDetail(params: { id: string }) {
    const { customer, fetchCustomer } = useCustomerStore();
    const productId = params.id;
    const router = useRouter();

    React.useEffect(() => {
        if (productId) {
            fetchCustomer(Number(productId));
        }
    }, [productId, fetchCustomer]);

    const handleBack = () => {
        router.back();
    };
    const columnKey = ['hair', 'address', 'bank', 'company', 'crypto'] // for customer details
    
    return (
        <div>
            <button onClick={handleBack} className="flex gap-2 p-4 hover:underline">
                <ArrowLeft /> Back
            </button>
            <Detail headingKey='firstName' subheadingKey='title' columnKey={columnKey} responseData={[customer]} /> {/* make sure response data is an array */}
        </div>
    );
}