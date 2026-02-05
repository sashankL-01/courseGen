import { useEffect } from 'react'
import { Link, useParams, NavLink } from 'react-router-dom'
import { Button } from '../components/ui/button.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/StateBlocks.jsx'
import { ChevronRight } from 'lucide-react'
import useStore from '../store/index.js'



function renderDescription(text, img_links = {}, ytvid_links = {}) {
    if (!text || typeof text !== "string") return null;

    const blocks = [];
    let key = 0;

    const placeholderRegex = /__(image|ytvid)(\d+)__/g;
    let workingText = text;
    let placeholderMatch;

    while ((placeholderMatch = placeholderRegex.exec(text)) !== null) {
        const [placeholder, type, id] = placeholderMatch;

        if (type === "image" && img_links[id]) {
            workingText = workingText.replace(placeholder, ' ');
        } else if (type === "ytvid" && ytvid_links[id]) {
            workingText = workingText.replace(placeholder, `__VIDURL__${ytvid_links[id]}__VIDURL__`);
        } else {
            workingText = workingText.replace(placeholder, ' ');
        }
    }

    // Remove any leftover image URL fragments
    workingText = workingText.replace(/https:\/\/images\.pexels\.com\/[^\s,\.]*/g, ' ');
    workingText = workingText.replace(/jpeg\?auto=compress[^\s,\.]*/gi, ' ');
    workingText = workingText.replace(/png\?auto=compress[^\s,\.]*/gi, ' ');
    workingText = workingText.replace(/webp\?auto=compress[^\s,\.]*/gi, ' ');
    workingText = workingText.replace(/jpg\?auto=compress[^\s,\.]*/gi, ' ');

    // Also wrap any raw YouTube URLs with markers for consistent processing
    workingText = workingText.replace(/(https:\/\/(?:www\.)?youtube\.com\/watch\?v=[^\s,\.]+)/g, '__VIDURL__$1__VIDURL__');

    // Clean up multiple spaces
    workingText = workingText.replace(/\s+/g, ' ').trim();

    // Find YouTube videos to embed
    const youtubeUrlRegex = /__VIDURL__(https:\/\/(?:www\.)?youtube\.com\/watch\?v=[^\s]+?)__VIDURL__/g;
    const videoMatches = [];
    let match;

    while ((match = youtubeUrlRegex.exec(workingText)) !== null) {
        videoMatches.push({
            index: match.index,
            length: match[0].length,
            url: match[1]
        });
    }

    if (videoMatches.length === 0) {
        // No videos, just return the text as paragraphs
        const paragraphs = workingText.split(/\n\n+/).filter(p => p.trim());
        paragraphs.forEach(para => {
            blocks.push(
                <p key={`p-${key++}`} className="leading-relaxed">
                    {para.trim()}
                </p>
            );
        });
    } else {
        // Process text with videos
        let lastIndex = 0;

        videoMatches.forEach((item) => {
            // Add text before video
            if (item.index > lastIndex) {
                let textBefore = workingText.substring(lastIndex, item.index).trim();
                if (textBefore) {
                    const paragraphs = textBefore.split(/\n\n+/).filter(p => p.trim());
                    paragraphs.forEach(para => {
                        blocks.push(
                            <p key={`p-${key++}`} className="leading-relaxed">
                                {para.trim()}
                            </p>
                        );
                    });
                }
            }

            // Add video element
            try {
                const videoId = new URL(item.url).searchParams.get("v");
                if (videoId) {
                    blocks.push(
                        <figure key={`vid-${key++}`} className="my-6">
                            <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                className="mx-auto w-full max-w-3xl aspect-video rounded-lg"
                                title="Course video"
                                allowFullScreen
                            />
                        </figure>
                    );
                }
            } catch (e) {
                console.error('Error parsing video URL:', e);
            }

            lastIndex = item.index + item.length;
        });

        // Add remaining text
        if (lastIndex < workingText.length) {
            let remainingText = workingText.substring(lastIndex).trim();
            if (remainingText) {
                const paragraphs = remainingText.split(/\n\n+/).filter(p => p.trim());
                paragraphs.forEach(para => {
                    blocks.push(
                        <p key={`p-${key++}`} className="leading-relaxed">
                            {para.trim()}
                        </p>
                    );
                });
            }
        }
    }

    return (
        <div className="max-w-3xl space-y-4 text-sm text-muted-foreground">
            {blocks}
        </div>
    );
}

function parseDescription(raw) {
    if (!raw) return null;
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }
    return raw;
}


const sampleCourse = {
    title: 'Intro to Prompt Engineering',
    description:
        'Learn how to craft effective prompts, structure workflows, and refine outputs for real-world use cases.',
    progress: 42,
    sections: [
        {
            id: 'section-1',
            title: 'Foundations of Prompting',
            duration: '12 min',
            status: 'Complete',
        },
        {
            id: 'section-2',
            title: 'Prompt Patterns & Templates',
            duration: '18 min',
            status: 'In progress',
        },
        {
            id: 'section-3',
            title: 'Evaluation & Iteration',
            duration: '16 min',
            status: 'Locked',
        },
    ],
}

function CourseDetails() {
    const { courseId } = useParams()
    const fetchCourseById = useStore((state) => state.fetchCourseById)
    const { course, status: courseStatus, error: courseError } = useStore((state) => state.courses)

    const isLoadingCourse = courseStatus === 'loading'
    const sections = course?.sections ?? []
    const sectionTitles = course?.sectionTitles ?? []

    useEffect(() => {
        if (!courseId) {
            return
        }

        fetchCourseById(courseId)
    }, [courseId, fetchCourseById])

    // Show loading if status is loading OR if we don't have course yet and no error
    if (isLoadingCourse || (!course && !courseError)) {
        return (
            <div className="space-y-6">
                <LoadingState label="Loading course" description="Fetching course details..." />
            </div>
        )
    }

    if (courseError) {
        return (
            <div className="space-y-6">
                <ErrorState title="Error loading course" description={courseError} />
            </div>
        )
    }

    if (!course) {
        return (
            <div className="space-y-6">
                <ErrorState title="Course not found" description="The course you're looking for doesn't exist or has been removed." />
            </div>
        )
    }

    const desc = parseDescription(course.description);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-center gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        Course
                    </p>
                    <h1 className="text-2xl font-semibold">{course.title}</h1>
                    {desc && renderDescription(
                        desc.text,
                        desc.img_links,
                        desc.ytvid_links
                    )}
                </div>
            </div>

            {/* {!isLoadingSections && !error && sections.length > 0 && (
                <nav className="border-b border-border/40" aria-label="Sections navigation">
                    <div className="-mb-px flex gap-1 overflow-x-auto">
                        {sections.map((section, index) => (
                            <NavLink
                                key={section.id}
                                to={`/app/courses/${courseId}/sections/${section.id}`}
                                className={({ isActive }) =>
                                    `group flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition ${isActive
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-muted-foreground hover:border-border/60 hover:text-foreground'
                                    }`
                                }
                            >
                                <span className="text-xs font-medium">{index + 1}</span>
                                <span className="truncate">{section.title}</span>
                                <ChevronRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
                            </NavLink>
                        ))}
                    </div>
                </nav> 
            )} */}

            <section className="space-y-3">
                <h2 className="text-base font-semibold">Sections</h2>
                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                        {sections.length} {sections.length === 1 ? 'section' : 'sections'} in this course
                    </p>
                </div>
            </section>

            <section className="space-y-4">


                {sectionTitles.length === 0 && (
                    <EmptyState title="No sections yet" description="Sections are being generated for this course." />
                )}

                {sections.length > 0 && (
                    <div className="space-y-5">
                        {sectionTitles.map((sectionTitle, index) => (
                            <div key={sectionTitle.id || sectionTitle._id || index} className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{sectionTitle}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Section {index + 1}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button size="sm" asChild>
                                        <Link to={`/app/courses/${courseId}/sections/${sections[index]}`}>Open</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default CourseDetails
