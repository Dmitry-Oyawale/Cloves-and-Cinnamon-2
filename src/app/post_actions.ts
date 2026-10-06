"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hexclaveServerApp } from "@/hexclave/server";
import { db } from "@/lib/prisma";

async function ownerId() {
    const user = await hexclaveServerApp.getUser();
    if (!user) throw new Error("Sign in to change tasks.");
    return user.id;
}

function fields(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim()
    const content = String(formData.get("content") ?? "").trim()

    if (!title || title.length > 120 || content.length > 2000) 
        throw new Error("Title is required (max 120); content max 2000");
    return { title, content };
}

export async function getPosts(searchTerm? : string) {
    const userId = await ownerId()

    let query = db.orm.public.Post.where({
        ownerId: userId 
    })

    const term = searchTerm?.trim()

    if (!term) return await query.all()

    const [titleMatches, contentMatches] = await Promise.all([
        query.where((post) => post.title.ilike(`%${term}%`)).all(),
        query.where((post) => post.content.ilike(`%${term}%`)).all(),
    ]);

    const titleIds = new Set(titleMatches.map((post) => post.id));

    return [
        ...titleMatches,
        ...contentMatches.filter((post) => !titleIds.has(post.id)),
    ]
}
