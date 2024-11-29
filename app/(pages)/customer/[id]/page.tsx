"use client";
import React from "react";
import { CustomerDetail } from "@/components/structure/template/Customer";

export default function page({ params }: { params: { id: string } }) {
  const customerId = params.id;
  return (
    <>
      <CustomerDetail id={customerId} />
    </>
  )
}
