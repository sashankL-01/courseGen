import { Button } from './ui/button.jsx'

function LoadingState({ label = 'Loading', description = 'Please wait while we fetch data.' }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
            <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

function EmptyState({ title = 'Nothing here yet', description = 'Try creating something new.' }) {
    return (
        <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    )
}

function ErrorState({ title = 'Something went wrong', description = 'Please try again.', onRetry }) {
    return (
        <div className="space-y-1">
            <div className="text-sm font-medium text-destructive">{title}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
            {onRetry && (
                <Button size="sm" variant="link" onClick={onRetry} className="h-auto px-0 text-xs">
                    Retry
                </Button>
            )}
        </div>
    )
}

export { LoadingState, EmptyState, ErrorState }
