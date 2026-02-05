import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/StateBlocks.jsx'
import {
    BookOpen,
    Plus,
    Search,
    Grid3x3,
    List,
    Trash2,
    Calendar,
    BookMarked,
    Sparkles
} from 'lucide-react'
import useStore from '../store/index.js'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog.jsx'

function Courses() {
    const navigate = useNavigate()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newCourseTopic, setNewCourseTopic] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [createError, setCreateError] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [courseToDelete, setCourseToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const setFilters = useStore((state) => state.setFilters)
    const uiFilters = useStore((state) => state.ui.filters)
    const courseFilters = uiFilters.courses ?? {
        view: 'grid',
        query: '',
        page: 1,
    }
    const view = courseFilters.view ?? 'grid'
    const query = courseFilters.query ?? ''
    const page = courseFilters.page ?? 1
    const pageSize = 9

    const fetchCourses = useStore((state) => state.fetchCourses)
    const createCourse = useStore((state) => state.createCourse)
    const deleteCourse = useStore((state) => state.deleteCourse)
    const coursesState = useStore((state) => state.courses)
    const courses = coursesState.items || []
    const isLoading = coursesState.status === 'loading'
    const error = coursesState.error

    const updateCourseFilters = (updates) => {
        setFilters({
            courses: {
                ...courseFilters,
                ...updates,
            },
        })
    }

    useEffect(() => {
        if (coursesState.status === 'idle') {
            fetchCourses()
        }
    }, [coursesState.status, fetchCourses])

    const handleCreateCourse = async () => {
        if (!newCourseTopic.trim()) {
            setCreateError('Please enter a topic')
            return
        }

        setIsCreating(true)
        setCreateError(null)

        try {
            const newCourse = await createCourse(newCourseTopic.trim())
            if (newCourse) {
                setIsCreateDialogOpen(false)
                setNewCourseTopic('')
                // Refresh courses list
                await fetchCourses()
                // Navigate to the new course
                navigate(`/app/courses/${newCourse.id}`)
            } else {
                setCreateError('Failed to create course. Please try again.')
            }
        } catch (err) {
            setCreateError(err.message || 'Failed to create course')
        } finally {
            setIsCreating(false)
        }
    }

    const handleDeleteClick = (course) => {
        setCourseToDelete(course)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!courseToDelete) return

        setIsDeleting(true)
        try {
            const success = await deleteCourse(courseToDelete.id)
            if (success) {
                setDeleteDialogOpen(false)
                setCourseToDelete(null)
            }
        } catch (err) {
            console.error('Failed to delete course:', err)
        } finally {
            setIsDeleting(false)
        }
    }

    const filtered = useMemo(() => {
        if (!query.trim()) {
            return courses
        }
        return courses.filter((course) =>
            course.title.toLowerCase().includes(query.toLowerCase()) ||
            course.prompt?.toLowerCase().includes(query.toLowerCase())
        )
    }, [courses, query])

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently'
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now - date)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <BookMarked className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold">My Courses</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {courses.length === 0
                            ? 'Create your first AI-powered course'
                            : `${courses.length} course${courses.length !== 1 ? 's' : ''} available`}
                    </p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="gap-2">
                            <Plus className="h-5 w-5" />
                            Generate New Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Generate AI Course
                            </DialogTitle>
                            <DialogDescription>
                                Enter a topic and our AI will generate a comprehensive course with sections and MCQs.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Course Topic</label>
                                <Input
                                    placeholder="e.g., Python Programming, Machine Learning, React Basics"
                                    value={newCourseTopic}
                                    onChange={(e) => setNewCourseTopic(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isCreating) {
                                            handleCreateCourse()
                                        }
                                    }}
                                    disabled={isCreating}
                                />
                                {createError && (
                                    <p className="text-sm text-destructive">{createError}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCreateCourse}
                                    disabled={isCreating || !newCourseTopic.trim()}
                                    className="flex-1"
                                >
                                    {isCreating ? 'Generating...' : 'Generate Course'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsCreateDialogOpen(false)
                                        setNewCourseTopic('')
                                        setCreateError(null)
                                    }}
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses by title or topic..."
                        value={query}
                        onChange={(e) => updateCourseFilters({ query: e.target.value, page: 1 })}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={view === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => updateCourseFilters({ view: 'grid' })}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={view === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => updateCourseFilters({ view: 'list' })}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            {isLoading && (
                <LoadingState
                    label="Loading your courses"
                    description="Please wait while we fetch your courses..."
                />
            )}

            {!isLoading && error && (
                <ErrorState
                    title="Unable to load courses"
                    description={error}
                />
            )}

            {!isLoading && !error && courses.length === 0 && (
                <EmptyState
                    title="No courses yet"
                    description="Get started by generating your first AI-powered course. Click the button above to begin!"
                    action={
                        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Generate Your First Course
                        </Button>
                    }
                />
            )}

            {!isLoading && !error && courses.length > 0 && filtered.length === 0 && (
                <EmptyState
                    title="No matching courses"
                    description="Try adjusting your search query."
                />
            )}

            {!isLoading && !error && filtered.length > 0 && (
                <>
                    <div className={
                        view === 'grid'
                            ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                            : 'space-y-4'
                    }>
                        {paged.map((course) => (
                            <div
                                key={course.id}
                                className={`group border border-border rounded-lg p-5 hover:border-primary transition-all hover:shadow-md ${view === 'list' ? 'flex items-start gap-4' : 'space-y-4'
                                    }`}
                            >
                                {/* Course Icon/Thumbnail */}
                                <div className={`${view === 'list' ? 'w-16 h-16' : 'w-full h-32'} bg-primary/10 rounded-lg flex items-center justify-center shrink-0`}>
                                    <BookOpen className={`${view === 'list' ? 'h-8 w-8' : 'h-12 w-12'} text-primary`} />
                                </div>

                                <div className="flex-1 space-y-3">
                                    {/* Course Info */}
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                            {course.title}
                                        </h3>
                                        {course.prompt && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {course.prompt}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="h-3 w-3" />
                                                <span className="font-medium">{course.sections?.length || 0}</span> section{(course.sections?.length || 0) !== 1 ? 's' : ''}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Created {formatDate(course.createdAt || course.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button size="sm" asChild className="flex-1">
                                            <Link to={`/app/courses/${course.id}`}>
                                                View Course
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDeleteClick(course)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length} courses
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateCourseFilters({ page: page - 1 })}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (page <= 3) {
                                            pageNum = i + 1
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = page - 2 + i
                                        }
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={page === pageNum ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => updateCourseFilters({ page: pageNum })}
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateCourseFilters({ page: page + 1 })}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Course</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone and will also delete all sections associated with this course.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 justify-end pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDeleteDialogOpen(false)
                                setCourseToDelete(null)
                            }}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Courses
