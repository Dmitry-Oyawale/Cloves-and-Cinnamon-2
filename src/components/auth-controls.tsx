"use client"
import {useUser } from "@hexclave/next";
import {hexclaveClientApp } from "@/hexclave/client"
import { Button } from "@/components/ui/button";

export function AuthControls() {
    const user = useUser();
    return <Button type="button" variant="outline" onClick={() => {
        if (user) void hexclaveClientApp.redirectToSignOut();
        else void hexclaveClientApp.redirectToSignIn();

    }}>{user ? "Sign out" : "Sign in"}</Button>
}