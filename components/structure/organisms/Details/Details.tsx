import * as React from "react";
import ImageCard from "@/components/structure/molecules/ImageCarousel";
import Tabs from "@/components/structure/molecules/Tabs";
import { Heading } from "@/components/structure/atoms/Heading";
import { DetailProps } from "@/components/types/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj: any, key: string): any {
  if (!obj || typeof obj !== "object") return null;
  if (obj[key] !== undefined) return obj[key];
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const value = getNestedValue(item, key);
      if (value !== null) return value;
    }
  } else {
    for (const prop in obj) {
      const value = getNestedValue(obj[prop], key);
      if (value !== null) return value;
    }
  }
  return null;
}

// take heading(key) and subheading(key) as props and response data as props
export function Detail({
  headingKey,
  subheadingKey,
  columnKey,
  responseData,
}: DetailProps) {
  const data = responseData.length > 0 ? responseData[0] : null;
  const heading = data
    ? getNestedValue(data, headingKey)
    : "Heading Not Defined";
  const subheading = data
    ? getNestedValue(data, subheadingKey)
    : "Subheading Not Defined";
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);

  const getImageFromData = () => {
    const urls: string[] = [];
    const validExtensions = ['.jpg', '.jpeg', '.png'];
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extractImageUrls = (obj: any): void => {
      // If obj is a string, check if it's an image URL
      if (typeof obj === 'string') {
        const hasValidExtension = validExtensions.some(ext => 
          obj.toLowerCase().endsWith(ext)
        );
        if (hasValidExtension) {
          urls.push(obj);
        }
        return;
      }
  
      if (Array.isArray(obj)) {
        obj.forEach(item => extractImageUrls(item));
        return;
      }
  
      if (!obj || typeof obj !== 'object') {
        return;
      }
  
      Object.entries(obj).forEach(([key, value]) => {
        const isImageKey = /image|img/i.test(key);
  
        if (isImageKey) {
          // Process the value directly
          extractImageUrls(value);
        } else {
          // For non-image keys, check if the value is an object or array
          // that might contain image URLs deeper in the structure
          if (typeof value === 'object' && value !== null) {
            extractImageUrls(value);
          }
        }
      });
    };
  
    Object.values(responseData).forEach((item) => {
      if (item !== null) {
        extractImageUrls(item);
      }
    });
  
    setImageUrls(urls);
  };

  React.useEffect(() => {
    getImageFromData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseData]);

  return (
    // outer section
    <section className="flex h-screen flex-col p-4">
      {/* Top section */}
      <div className="flex items-start gap-x-52">
        <Heading heading={heading} subheading={subheading} />
        <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden">
          <ImageCard images={imageUrls} />
        </div>
      </div>

      <div className="flex flex-grow justify-center">
        <div className="w-full rounded-lg border border-gray-300 bg-white shadow-lg">
          <Tabs data={responseData} tabColumnKeys={columnKey} />
        </div>
      </div>
    </section>
  );
}
