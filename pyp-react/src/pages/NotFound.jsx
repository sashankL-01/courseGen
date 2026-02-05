import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button.jsx'

function NotFound() {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-muted-foreground">
                The page you are looking for does not exist.
            </p>
            <Button asChild variant="outline">
                <Link to="/">Go back home</Link>
            </Button>
        </div>
    )
}

export default NotFound
