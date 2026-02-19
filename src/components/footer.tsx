import { Github } from "lucide-react"
// GitHub icon component from lucide-react icon library

import Link from "next/link"
// Next.js optimized Link component for internal and external navigation

export function Footer() {
    return (
        // Footer wrapper with top border and theme-aware background
        <footer className="w-full border-t bg-background">

            {/* Centered container with responsive layout */}
            <div className="container max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 py-12 md:h-32 md:flex-row md:py-0">

                {/* Left side: attribution and source links */}
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    
                    {/* Footer text */}
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}

                        {/* Author / creator link */}
                        <Link
                            href="https://twitter.com/yourusername"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            your-name
                        </Link>

                        {/* Static text */}
                        . The source code is available on{" "}

                        {/* GitHub repository link */}
                        <Link
                            href="https://github.com/yourusername/your-repo"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </Link>
                        .
                    </p>
                </div>

                {/* Right side: icon-only GitHub link */}
                <div className="flex items-center gap-4">
                    <Link
                        href="https://github.com/yourusername/your-repo"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {/* GitHub icon with hover color transition */}
                        <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                </div>
            </div>
        </footer>
    )
}
