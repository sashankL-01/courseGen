import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import Footer from '../components/Footer.jsx'
import { confirmPasswordReset } from '../services/auth.js'

function ResetPassword() {
    const [values, setValues] = useState({ password: '', confirm: '' })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchParams] = useSearchParams()

    const handleChange = (field) => (event) => {
        setValues((prev) => ({ ...prev, [field]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const nextErrors = {}
        const token = searchParams.get('token')

        if (!values.password) {
            nextErrors.password = 'Password is required'
        } else if (values.password.length < 6) {
            nextErrors.password = 'Password must be at least 6 characters'
        }
        if (!values.confirm) {
            nextErrors.confirm = 'Please confirm your password'
        } else if (values.confirm !== values.password) {
            nextErrors.confirm = 'Passwords do not match'
        }

        if (!token) {
            nextErrors.token = 'Reset token is missing'
        }

        setErrors(nextErrors)
        setSuccess('')

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        setIsSubmitting(true)
        try {
            const response = await confirmPasswordReset({
                token,
                newPassword: values.password,
            })
            setSuccess(response?.message || 'Password updated successfully.')
        } catch (err) {
            setErrors({ form: err?.message || 'Unable to reset password' })
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
                        <h1 className="text-2xl font-semibold">Set a new password</h1>
                        <p className="text-sm text-muted-foreground">
                            Choose a strong password to secure your account.
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        {errors.token && <p className="text-xs text-destructive">{errors.token}</p>}
                        {errors.form && <p className="text-xs text-destructive">{errors.form}</p>}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                New password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={values.password}
                                onChange={handleChange('password')}
                            />
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Confirm password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={values.confirm}
                                onChange={handleChange('confirm')}
                            />
                            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
                        </div>
                        {success && <p className="text-xs text-emerald-500">{success}</p>}
                        <Button className="w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update password'}
                        </Button>
                        <div className="text-xs text-muted-foreground">
                            Back to{' '}
                            <Link to="/login" className="text-foreground underline">
                                log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ResetPassword
