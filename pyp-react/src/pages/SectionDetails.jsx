import { useEffect, useState, useRef, useMemo } from 'react'
import { Link, useParams, NavLink } from 'react-router-dom'
import { Button } from '../components/ui/button.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/StateBlocks.jsx'
import { ArrowLeft, Check, X } from 'lucide-react'
import useStore from '../store/index.js'

const MCQComponent = ({
    question,
    options,
    answer,        // answer value (string)
    index,
    explanation,   // optional
}) => {
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [submitted, setSubmitted] = useState(false)

    // Shuffle options ONCE
    const shuffledOptions = useMemo(() => {
        return [...options].sort(() => Math.random() - 0.5)
    }, [options])

    const correctIndex = shuffledOptions.findIndex(
        (opt) => opt === answer
    )

    const isCorrect =
        submitted && selectedIndex === correctIndex

    const handleSubmit = () => {
        if (selectedIndex === null) return
        setSubmitted(true)
    }

    const handleRetry = () => {
        setSelectedIndex(null)
        setSubmitted(false)
    }

    return (
        <div className="my-8 p-6 border border-border rounded-lg bg-muted/30">
            {/* Question */}
            <h3 className="text-base font-semibold mb-2">
                Question {index}
            </h3>
            <p className="text-sm mb-4">{question}</p>

            {/* Options */}
            <div className="space-y-2">
                {shuffledOptions.map((option, idx) => {
                    const isSelected = idx === selectedIndex
                    const isCorrectOption =
                        submitted && idx === correctIndex
                    const isWrongSelection =
                        submitted &&
                        isSelected &&
                        idx !== correctIndex

                    return (
                        <button
                            key={idx}
                            onClick={() =>
                                !submitted && setSelectedIndex(idx)
                            }
                            className={`w-full text-left p-3 rounded-md border transition
                                ${isCorrectOption
                                    ? "border-green-500 bg-green-500/10"
                                    : isWrongSelection
                                        ? "border-red-500 bg-red-500/10"
                                        : isSelected
                                            ? "border-primary bg-primary/10"
                                            : "border-border bg-background hover:bg-accent"
                                }
                            `}
                            aria-pressed={isSelected}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm">
                                    {option}
                                </span>

                                {submitted && isCorrectOption && (
                                    <Check className="h-4 w-4 text-green-500" />
                                )}

                                {submitted && isWrongSelection && (
                                    <X className="h-4 w-4 text-red-500" />
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedIndex === null}
                        className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground disabled:opacity-50"
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        onClick={handleRetry}
                        className="px-4 py-2 text-sm rounded-md border border-border hover:bg-accent"
                    >
                        Retry
                    </button>
                )}
            </div>

            {/* Feedback */}
            {submitted && (
                <div
                    className={`mt-4 p-3 rounded-md text-sm
                        ${isCorrect
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }
                    `}
                >
                    {isCorrect
                        ? "✓ Correct!"
                        : `✗ Incorrect. Correct answer: ${answer}`}

                    {explanation && (
                        <p className="mt-2 text-muted-foreground">
                            {explanation}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

// Section Content Renderer
function renderSectionContent(content) {
    if (!content || !content.text) return null

    const blocks = []
    let key = 0

    const { text, image_links = [], youtube_links = [], mcqs = [], headers = {} } = content

    // Process text to replace placeholders with actual content
    let workingText = text

    // Replace heading placeholders with actual headings
    if (headers.h1) {
        Object.entries(headers.h1).forEach(([id, headingText]) => {
            const placeholder = `__h1_${id}__`
            workingText = workingText.replace(
                placeholder,
                `__HEADING1__${headingText}__HEADING1__`
            )
        })
    }

    if (headers.h2) {
        Object.entries(headers.h2).forEach(([id, headingText]) => {
            const placeholder = `__h2_${id}__`
            workingText = workingText.replace(
                placeholder,
                `__HEADING2__${headingText}__HEADING2__`
            )
        })
    }

    // Replace image placeholders with actual URLs
    image_links.forEach((url, index) => {
        const placeholder = `__image${index + 1}__`
        workingText = workingText.replace(placeholder, `__IMGURL__${url}__IMGURL__`)
    })

    // Replace video placeholders with actual URLs
    youtube_links.forEach((url, index) => {
        const placeholder = `__ytvid${index + 1}__`
        workingText = workingText.replace(placeholder, `__VIDURL__${url}__VIDURL__`)
    })

    // Replace MCQ placeholders
    mcqs.forEach((_, index) => {
        const placeholder = `__mcq${index + 1}__`
        workingText = workingText.replace(placeholder, `__MCQ__${index + 1}__MCQ__`)
    })

    // Parse the working text to extract all elements in order
    const elementRegex = /__(HEADING1|HEADING2|IMGURL|VIDURL|MCQ)__(.+?)__\1__/g
    const allMatches = []
    let match

    while ((match = elementRegex.exec(workingText)) !== null) {
        allMatches.push({
            index: match.index,
            length: match[0].length,
            type: match[1],
            content: match[2]
        })
    }

    // Sort matches by index
    allMatches.sort((a, b) => a.index - b.index)

    let lastIndex = 0

    allMatches.forEach((item) => {
        // Add text before this element
        if (item.index > lastIndex) {
            const textBefore = workingText.substring(lastIndex, item.index).trim()
            if (textBefore) {
                // Split by double newlines to create paragraphs
                const paragraphs = textBefore.split(/\n\n+/).filter(p => p.trim())
                paragraphs.forEach(para => {
                    blocks.push(
                        <p key={`p-${key++}`} className="leading-relaxed text-base mb-4">
                            {para.trim()}
                        </p>
                    )
                })
            }
        }

        // Add the element
        if (item.type === 'HEADING1') {
            blocks.push(
                <h1 key={`h1-${key++}`} className="text-2xl font-bold mt-8 mb-4">
                    {item.content}
                </h1>
            )
        } else if (item.type === 'HEADING2') {
            blocks.push(
                <h2 key={`h2-${key++}`} className="text-xl font-semibold mt-6 mb-3">
                    {item.content}
                </h2>
            )
        } else if (item.type === 'IMGURL') {
            // Images replaced with space - do nothing
            blocks.push(
                <span key={`img-${key++}`}> </span>
            )
        } else if (item.type === 'VIDURL') {
            try {
                const videoId = new URL(item.content).searchParams.get('v')
                if (videoId) {
                    blocks.push(
                        <figure key={`vid-${key++}`} className="my-6">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className="mx-auto w-full max-w-3xl aspect-video rounded-lg"
                                title="Section video"
                                allowFullScreen
                            />
                        </figure>
                    )
                }
            } catch (e) {
                console.error('Error parsing video URL:', e)
            }
        } else if (item.type === 'MCQ') {
            const mcqIndex = parseInt(item.content)
            const mcq = mcqs[mcqIndex - 1]  // Content is 1-based, array is 0-based
            if (mcq) {
                blocks.push(
                    <MCQComponent
                        key={`mcq-${key++}`}
                        question={mcq.question}
                        options={mcq.options}
                        answer={mcq.answer}
                        index={mcqIndex}
                    />
                )
            }
        }

        lastIndex = item.index + item.length
    })

    // Add remaining text
    if (lastIndex < workingText.length) {
        const remainingText = workingText.substring(lastIndex).trim()
        if (remainingText) {
            const paragraphs = remainingText.split(/\n\n+/).filter(p => p.trim())
            paragraphs.forEach(para => {
                blocks.push(
                    <p key={`p-${key++}`} className="leading-relaxed text-base mb-4">
                        {para.trim()}
                    </p>
                )
            })
        }
    }
    // Add any MCQs that weren't placed in the text (fallback)
    const renderedMcqIndices = new Set()
    allMatches.forEach(item => {
        if (item.type === 'MCQ') {
            renderedMcqIndices.add(parseInt(item.content))
        }
    })

    mcqs.forEach((mcq, index) => {
        if (!renderedMcqIndices.has(index + 1)) {  // Check 1-based index
            blocks.push(
                <MCQComponent
                    key={`mcq-fallback-${key++}`}
                    question={mcq.question}
                    options={mcq.options}
                    answer={mcq.answer}
                    index={index + 1}
                />
            )
        }
    })

    return <div className="space-y-4">{blocks}</div>
}

const StepLoader = ({ step }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="space-y-3 text-sm">
                <p className={`flex items-center gap-2 ${step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step >= 1 ? "✓" : "○"} Analyzing topic
                </p>
                <p className={`flex items-center gap-2 ${step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step >= 2 ? "✓" : "○"} Generating content
                </p>
                <p className={`flex items-center gap-2 ${step >= 3 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step >= 3 ? "✓" : "○"} Creating MCQs
                </p>
                <p className={`flex items-center gap-2 ${step >= 4 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step >= 4 ? "✓" : "○"} Adding media placeholders
                </p>
                <p className={`flex items-center gap-2 ${step >= 5 ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step >= 5 ? "✓" : "○"} Fetching media
                </p>
            </div>
        </div>
    )
}

const SidebarSkeleton = () => {
    return (
        <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted/50 animate-pulse" />
                        <div className="h-4 bg-muted/50 rounded flex-1 animate-pulse" />
                    </div>
                ))}
            </div>
        </nav>
    )
}

function SectionDetails() {
    const { courseId, sectionId } = useParams()
    const fetchCourseById = useStore((state) => state.fetchCourseById)
    const fetchSectionById = useStore((state) => state.fetchSectionById)
    const { section, status, error } = useStore((state) => state.sections)

    const course = useStore((state) => state.courses.course)
    const courseTitle = course?.title || ''

    const allSections = course?.sections?.map((secId, index) => ({
        id: secId,
        title: course.sectionTitles?.[index] ?? `Section ${index + 1}`,
        order: index,
    })) ?? []

    const [loadingStep, setLoadingStep] = useState(0)
    const sidebarScrollRef = useRef(null)
    const mainScrollRef = useRef(null)

    const isLoading = status === 'loading'

    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
        }
        return () => {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto'
            }
        }
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [courseId, sectionId])

    useEffect(() => {
        if (sidebarScrollRef.current) sidebarScrollRef.current.scrollTop = 0
        if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0
    }, [sectionId])

    useEffect(() => {
        if (sidebarScrollRef.current && allSections.length > 0) {
            setTimeout(() => {
                if (sidebarScrollRef.current) sidebarScrollRef.current.scrollTop = 0
            }, 0)
        }
    }, [allSections.length])

    // Fetch course data to populate sidebar
    useEffect(() => {
        if (courseId && !course) {
            fetchCourseById(courseId)
        }
    }, [courseId, course, fetchCourseById])

    useEffect(() => {
        if (courseId && sectionId) {
            setLoadingStep(0)
            const steps = [
                { delay: 0, step: 1 },
                { delay: 1000, step: 2 },
                { delay: 3000, step: 3 },
                { delay: 5000, step: 4 },
                { delay: 7000, step: 5 },
            ]
            const timers = steps.map(({ delay, step }) =>
                setTimeout(() => setLoadingStep(step), delay)
            )
            fetchSectionById(courseId, sectionId)
            return () => timers.forEach(clearTimeout)
        }
    }, [courseId, sectionId, fetchSectionById])

    if (error) {
        return (
            <div className="flex w-full" style={{ height: 'calc(100vh - var(--app-navbar-height))' }}>
                <ErrorState title="Unable to load section" description={error} />
            </div>
        )
    }

    return (
        <div className="flex w-full overflow-hidden" style={{ height: 'calc(100vh - var(--app-navbar-height))' }}>
            {/* Left Sidebar - Fixed Width */}
            <aside className="w-82 border-r border-border bg-background flex flex-col flex-shrink-0 h-full">
                {/* Fixed Header */}
                <div className="flex-shrink-0 p-4 border-b border-border">
                    <Button variant="ghost" size="sm" className="w-full justify-start mb-3" asChild>
                        <Link to={`/app/courses/${courseId}`}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course
                        </Link>
                    </Button>
                    <h2 className="text-sm font-semibold truncate px-2" title={courseTitle}>
                        {courseTitle || <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />}
                    </h2>
                </div>

                {/* Scrollable Section List */}
                {allSections.length > 0 ? (
                    <nav ref={sidebarScrollRef} className="flex-1 overflow-y-auto p-2">
                        <div className="space-y-1">
                            {allSections.map((sec, index) => (
                                <NavLink
                                    key={sec.id}
                                    to={`/app/courses/${courseId}/sections/${sec.id}`}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${isActive
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`
                                    }
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                        {index + 1}
                                    </span>
                                    <span className="truncate flex-1">{sec.title}</span>
                                </NavLink>
                            ))}
                        </div>
                    </nav>
                ) : (
                    <SidebarSkeleton />
                )}
            </aside>

            {/* Main Content Area - Expands to fill remaining space */}
            <main ref={mainScrollRef} className="flex-1 overflow-y-auto h-full bg-background">
                {isLoading ? (
                    <StepLoader step={loadingStep} />
                ) : !section ? (
                    <div className="flex items-center justify-center h-full">
                        <EmptyState title="Section not found" description="The section you're looking for doesn't exist." />
                    </div>
                ) : (
                    <div className="w-full max-w-none p-8 lg:p-12 space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-6">
                            <div className="space-y-1">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    Section {section.order + 1}
                                </p>
                                <h1 className="text-3xl font-bold tracking-tight">{section.title}</h1>
                            </div>
                            {/* <div className="flex items-center gap-3">
                                <Button variant="outline">Edit section</Button>
                                <Button>Regenerate content</Button>
                            </div> */}
                        </div>

                        {/* Content Section */}
                        <section className="space-y-4">
                            {/* <h2 className="text-lg font-semibold">Content</h2> */}
                            <div className="prose prose-gray dark:prose-invert max-w-none">
                                {section.content?.text ? (
                                    renderSectionContent(section.content)
                                ) : (
                                    <EmptyState
                                        title="No content yet"
                                        description="Content is being generated for this section."
                                    />
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    )
}

export default SectionDetails;