"use client";
import React from 'react'
import { ProductDetail } from '@/components/structure/template/Product';

export default function page({ params }: { params: { id: string } }) {
  const productId = params.id;
  return (
    <>
      <ProductDetail id={productId} />
    </>
  )
}