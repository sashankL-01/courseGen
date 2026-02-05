import { Link } from 'react-router-dom'
import { BookMarked } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t border-border bg-background">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <BookMarked className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold">CourseGen</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link to="/app/courses" className="hover:text-foreground transition-colors">
                            Courses
                        </Link>
                        <Link to="/app/help" className="hover:text-foreground transition-colors">
                            Help
                        </Link>
                        <Link to="/signup" className="hover:text-foreground transition-colors">
                            Sign Up
                        </Link>
                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} CourseGen. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
