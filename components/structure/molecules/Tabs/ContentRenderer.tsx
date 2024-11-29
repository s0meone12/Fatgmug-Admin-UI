"use client";
import React from "react";

interface ContentRendererProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
}

export function ContentRenderer({ content }: ContentRendererProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderKeyValuePair = (key: string, value: any, level: number = 0) => (
        <div className="flex items-start border-b border-gray-200 py-2">
            <div className="flex-shrink-0">
                <span className={`text-gray-700 font-medium text-sm ${level > 0 ? "opacity-80" : ""}`}>
                    {key}
                </span>
            </div>
            <div className="flex-grow pl-4">
                {renderContent(value, level + 1)}
            </div>
        </div>
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderTwoColumnLayout = (items: any, level: number) => {
        const entries = Object.entries(items);
        return (
            <div className={`grid grid-cols-2 gap-x-12 gap-y-6 p-4 rounded-md ${level > 0 ? "bg-gray-50" : "bg-white"}`}>
                {entries.map(([key, value]) => (
                    <div key={key} className="min-w-full">
                        {renderKeyValuePair(
                            key.charAt(0).toUpperCase() + key.slice(1), 
                            value,
                            level
                        )}
                    </div>
                ))}
            </div>
        );
    };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderArrayContent = (arrayContent: any[], level: number) => (
        <div className="space-y-4">
            {arrayContent.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <div className="border-t border-gray-300 my-4" />}
                    <div className={`bg-white rounded-lg ${level > 0 ? "bg-gray-50" : "bg-white"}`}>
                        {renderContent(item, level + 1)}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderContent = (content: any, level: number = 0) => {
        if (Array.isArray(content)) {
            return renderArrayContent(content, level);
        } else if (typeof content === 'object' && content !== null) {
            return renderTwoColumnLayout(content, level);
        }
        return (
            <span className="text-gray-900 text-sm">
                {String(content)}
            </span>
        );
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow overflow-x-auto">
            {renderContent(content)}
        </div>
    );
}
