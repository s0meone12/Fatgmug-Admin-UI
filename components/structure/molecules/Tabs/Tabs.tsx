"use client";
import React from "react";
import {
  Tabs as ShadTab,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { ContentRenderer } from "@/components/structure/molecules/Tabs/ContentRenderer";

interface TabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  tabColumnKeys: string[];
}

export function Tabs({ tabColumnKeys, data }: TabProps) {
  if (!data || data.length === 0 || tabColumnKeys.length === 0) {
    return null;
  }

  const tabsData = tabColumnKeys
    .map((key) => ({
      col: key,
      content: data[0]?.[key],
    }))
    .filter((tab) => tab.content !== undefined);
    
  if (tabsData.length === 0) {
    return null;
  }
  console.log(tabsData);
  

  return (
    <div className="bg-white">
      <ShadTab defaultValue={tabsData[0].col} className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="flex w-full justify-start space-x-2 bg-transparent px-2">
            {tabsData.map((tab) => (
              
              <TabsTrigger
                key={tab.col}
                value={tab.col}
                className="px-3 py-1 text-sm font-medium"
              >
                {tab.col.charAt(0).toUpperCase() + tab.col.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabsData.map((tab) => (
          <TabsContent key={tab.col} value={tab.col} className="px-6 py-4">
            <ContentRenderer content={tab.content} />
          </TabsContent>
        ))}
      </ShadTab>
    </div>
  );
}
