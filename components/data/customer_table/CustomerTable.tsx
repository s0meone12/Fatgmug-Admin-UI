'use client'
import * as React from "react";
import { Table } from "@/components/structure/organisms/Table";
import { useCustomerStore } from "@/lib/store";
import ToastNotification from "@/components/structure/molecules/ToastNotification";

const CustomerTable: React.FC = () => {
    const { customers, fetchCustomers } = useCustomerStore();
  
    React.useEffect(() => {
      fetchCustomers();
    }, [fetchCustomers]);

    return (
      <>
        <Table data={customers} />
        <ToastNotification data={customers}/>
      </>
    );
  };
  
  export default CustomerTable;
