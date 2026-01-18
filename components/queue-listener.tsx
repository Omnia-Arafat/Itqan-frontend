"use client"

import { useEffect } from "react"
import { toast } from "sonner"

export default function QueueListener() {
    useEffect(() => {
        // Mock simulation for MVP demonstration
        const timer = setTimeout(() => {
            toast("Student Joined", {
                description: "Ahmed has joined the waiting room.",
                action: {
                    label: "Accept",
                    onClick: () => console.log("Accepted"),
                },
            })
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    return null
}
