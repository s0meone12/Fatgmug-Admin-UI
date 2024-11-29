"use client";
import * as React from "react";
import Image from "next/image";  
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/shadcn/carousel";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ImageCardProps } from "@/components/types/types";


export const ImageCarousel: React.FC<ImageCardProps> = ({ images }) => {

    return (
        <div className="flex justify-center items-center mx-auto w-full">
            <Carousel
                opts={{
                    align: "start",
                }}
                className="relative w-full max-w-xl " 
            >
                <CarouselContent className="flex w-full h-full">
                    {images.map((url, index) => (
                        <CarouselItem key={index} className="w-full h-full flex-shrink-0">
                            <div className="relative group w-full h-full">
                                <Card className="relative w-full h-full rounded-lg overflow-hidden shadow-md">
                                    <CardContent className="p-0">
                                        <Image
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            width={150}
                                            height={150}
                                            className="w-full h-full object-cover"
                                        />

                                        <div className="absolute inset-0 flex justify-center items-end bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                                            <div className="hidden group-hover:flex space-x-4 p-2">
                                                <button className="p-2 bg-white rounded-full shadow hover:shadow-lg transition">
                                                    <Pencil1Icon className="w-3 h-3 text-black" />
                                                </button>
                                                <button className="p-2 bg-white rounded-full shadow hover:shadow-lg transition">
                                                    <TrashIcon className="w-3 h-3 text-black" />
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {images.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-1  transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10" />
                        <CarouselNext className="absolute right-5  transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10" />
                    </>
                )}
            </Carousel>
        </div>
    );
};
