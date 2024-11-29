import { DetailHeaderI } from "@/components/types/types";

export function Heading({heading, subheading}: DetailHeaderI) {
    return(
        <div>
            <div className="flex flex-col mr-4 max-w-2xl">
                    <h1 className="text-4xl font-bold text-yellow-400">{heading}</h1>
                    <p>{subheading}</p>
            </div>
        </div>
    )
}