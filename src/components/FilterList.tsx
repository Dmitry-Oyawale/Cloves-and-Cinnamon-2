"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getPosts } from "@/app/post_actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"
import { Combobox } from "./ui/combo-box"
import { Search } from "lucide-react"
import { searchResultErrorSchema } from "shadcn/schema"


export default function FilterList() {
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    async function handleSearch() {
        const filteredPosts = await getPosts(searchTerm)
        return filteredPosts
    }

    return (
        <div className="flex justify-center w-full my-5">
            <div className="w-full max-w-2xl flex items-center gap-5">
                <Search/>
                <Input placeholder="Filter posts..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Combobox is a custom component and does not receive a browser event unlike Input, which is native to HTML  */}
            <Combobox value={selectedCategory} onChange={(val) => setSelectedCategory(val)}/>
        </div>
    )

}