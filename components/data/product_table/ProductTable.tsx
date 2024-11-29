import * as React from "react";
import { Table } from "@/components/structure/organisms/Table";
import { useProductStore } from "@/lib/store";
import ToastNotification from "@/components/structure/molecules/ToastNotification";


const ProductTable: React.FC = () => {
    const { products, fetchProducts } = useProductStore();
  
    React.useEffect(() => {
      fetchProducts();
    }, [fetchProducts]);
    
    return (
      <>
        <Table data={products} />
        <ToastNotification data={products}/>
      </>
    );
  };
  
  export default ProductTable;
