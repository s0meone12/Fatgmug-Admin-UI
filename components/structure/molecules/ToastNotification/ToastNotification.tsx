'use client'
import React, { useEffect, useRef } from 'react'
import { Toaster, toast } from 'sonner'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ToastNotification( {data}: {data: any[]}) {

  //use ref hook to track toast msg has already been shown.
  const hasShownToast = useRef(false);
  useEffect(() => {
    if (data && !hasShownToast.current) {
      toast.success(`Data loaded successfully.`);
      //seted the flag to true after showing toast message.
      hasShownToast.current = true; 
    }
  }, [data]);
    return (
      <div>
        <Toaster richColors/>
      </div>
    );
}
