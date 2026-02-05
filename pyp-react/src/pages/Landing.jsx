import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button.jsx'
import Footer from '../components/Footer.jsx'

const highlights = [
    {
        title: 'Instant course generation',
        body: 'Transform a simple prompt into a structured course outline in seconds.',
    },
    {
        title: 'Section-by-section clarity',
        body: 'Keep every lesson organized with clear objectives and sequencing.',
    },
    {
        title: 'Personalized learning paths',
        body: 'Tune content to your goals, audience, and delivery style.',
    },
]

function Landing() {
    return (
        <div className="min-h-screen text-foreground">
            <header className="bg-background/70 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
                    <Link to="/" className="text-lg font-semibold tracking-wide">
                        CourseGen
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" asChild>
                            <Link to="/login">Log in</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/signup">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12">
                <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                            Build smarter courses
                        </p>
                        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                            Turn a single prompt into a complete learning experience.
                        </h1>
                        <p className="max-w-xl text-base text-muted-foreground">
                            CourseGen helps you create structured, high-quality courses with AI-powered
                            outlines, section breakdowns, and editable content you control.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button size="lg" asChild>
                                <Link to="/signup">Start building</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link to="/login">I already have an account</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Highlights</h2>
                        <div className="space-y-4">
                            {highlights.map((item) => (
                                <div key={item.title} className="space-y-1">
                                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {['Curated sections', 'Smart summaries', 'Editable content'].map((item) => (
                        <div key={item} className="space-y-2">
                            <p className="text-sm font-semibold">{item}</p>
                            <p className="text-sm text-muted-foreground">
                                Keep your learners aligned with clear goals and structured content.
                            </p>
                        </div>
                    ))}
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default Landing
