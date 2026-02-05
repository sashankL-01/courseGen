import { Component } from 'react'
import { Button } from './ui/button.jsx'

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({
            error,
            errorInfo
        })
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
        window.location.href = '/'
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full space-y-6 text-center">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold text-foreground">
                                Something went wrong
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                The application encountered an unexpected error.
                                We've logged this issue and will look into it.
                            </p>
                        </div>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-left">
                                <p className="text-xs font-mono text-destructive break-all">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                                            Stack trace
                                        </summary>
                                        <pre className="mt-2 text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={this.handleReload}
                            >
                                Reload Page
                            </Button>
                            <Button onClick={this.handleReset}>
                                Go to Home
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
