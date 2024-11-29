"use client";
import React from 'react'

export default function page({ params }: { params: { id: string } }) {
    const orderId = params.id;
    return (
        <>
          <h1>order id: {orderId}</h1>
        </>
    )
}
