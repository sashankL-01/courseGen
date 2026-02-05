import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import Footer from '../components/Footer.jsx'
import { requestPasswordReset } from '../services/auth.js'

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSuccess('')
        if (!email) {
            setError('Email is required')
            return
        }
        if (!validateEmail(email)) {
            setError('Enter a valid email')
            return
        }
        setError('')
        setIsSubmitting(true)

        try {
            const response = await requestPasswordReset(email)
            setSuccess(response?.message || 'Reset link sent. Check your inbox.')
        } catch (err) {
            setError(err?.message || 'Unable to send reset link')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen text-foreground">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12">
                <Link to="/" className="text-sm text-muted-foreground">
                    ← Back to landing
                </Link>
                <div className="mx-auto w-full max-w-md space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold">Reset your password</h1>
                        <p className="text-sm text-muted-foreground">
                            We will send a reset link to your email.
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Email
                            </label>
                            <Input
                                type="email"
                                placeholder="you@email.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            {error && <p className="text-xs text-destructive">{error}</p>}
                            {success && <p className="text-xs text-emerald-500">{success}</p>}
                        </div>
                        <Button className="w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send reset link'}
                        </Button>
                        <div className="text-xs text-muted-foreground">
                            Remembered your password?{' '}
                            <Link to="/login" className="text-foreground underline">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ForgotPassword
