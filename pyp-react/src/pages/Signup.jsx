import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import Footer from '../components/Footer.jsx'
import useStore from '../store/index.js'
import { register } from '../services/auth.js'

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value)

function Signup() {
    const [values, setValues] = useState({ name: '', email: '', password: '' })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const login = useStore((state) => state.login)
    const authStatus = useStore((state) => state.auth.status)

    const handleChange = (field) => (event) => {
        setValues((prev) => ({ ...prev, [field]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const nextErrors = {}

        if (!values.name) {
            nextErrors.name = 'Name is required'
        }
        if (!values.email) {
            nextErrors.email = 'Email is required'
        } else if (!validateEmail(values.email)) {
            nextErrors.email = 'Enter a valid email'
        }
        if (!values.password) {
            nextErrors.password = 'Password is required'
        } else if (values.password.length < 6) {
            nextErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        const registered = await register({
            username: values.name,
            email: values.email,
            password: values.password,
        })

        if (registered) {
            const result = await login({ email: values.email, password: values.password })
            if (result) {
                navigate('/app')
            }
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
                        <h1 className="text-2xl font-semibold">Create your account</h1>
                        <p className="text-sm text-muted-foreground">
                            Start building AI-powered courses in minutes.
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Name
                            </label>
                            <Input
                                type="text"
                                placeholder="Jane Doe"
                                value={values.name}
                                onChange={handleChange('name')}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Email
                            </label>
                            <Input
                                type="email"
                                placeholder="you@email.com"
                                value={values.email}
                                onChange={handleChange('email')}
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Password
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={values.password}
                                onChange={handleChange('password')}
                            />
                            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <Link to="/login" className="text-muted-foreground hover:text-foreground">
                                Already have an account?
                            </Link>
                        </div>
                        <Button className="w-full" type="submit" disabled={authStatus === 'loading'}>
                            {authStatus === 'loading' ? 'Creating account...' : 'Create account'}
                        </Button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Signup
