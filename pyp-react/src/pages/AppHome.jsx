import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import useStore from '../store/index.js'

function AppHome() {
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const navigate = useNavigate()
    const createCourse = useStore((state) => state.createCourse)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!prompt.trim() || isGenerating) return

        setIsGenerating(true)
        toast.info('Generating course...', { id: 'course-generation' })

        try {
            const newCourse = await createCourse(prompt.trim())
            if (newCourse) {
                toast.success('Course created successfully!', { id: 'course-generation' })
                navigate(`/app/courses/${newCourse.id}`)
            } else {
                toast.error('Failed to create course', { id: 'course-generation' })
            }
        } catch (error) {
            toast.error(error?.message || 'Failed to create course', { id: 'course-generation' })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
            <div className="mx-auto w-full max-w-3xl space-y-12">
                <div className="space-y-4 text-center">
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                        Learn Anything with AI-Powered Courses
                    </h1>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                        Enter any topic and our AI will instantly generate a comprehensive course with structured sections, detailed content, and practice questions.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="relative rounded-2xl border border-border/40 bg-background/50 p-4 shadow-lg backdrop-blur">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Python Programming, Machine Learning Basics, Web Development..."
                            className="min-h-24 w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                            rows={4}
                        />

                        <div className="flex items-center justify-between border-t border-border/40 pt-3">
                            <p className="text-xs text-muted-foreground">
                                click the button to generate
                            </p>
                            <button
                                type="submit"
                                disabled={!prompt.trim() || isGenerating}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition hover:brightness-90 disabled:opacity-40"
                                aria-label="Generate Course"
                            >
                                {isGenerating ? (
                                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                                ) : (
                                    <span className="text-xl leading-none">↑</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AppHome
