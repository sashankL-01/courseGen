import { Link } from 'react-router-dom'
import { ArrowLeft, HelpCircle, BookOpen, Video, MessageCircle } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'

const Help = () => {
    const faqs = [
        {
            question: "How do I create a new course?",
            answer: "Navigate to the Courses page and click the 'Generate New Course' button. Enter your topic and our AI will generate a comprehensive course structure for you."
        },
        {
            question: "Can I customize the generated courses?",
            answer: "Yes! After a course is generated, you can review and modify the content, sections, and MCQs to better suit your learning needs."
        },
        {
            question: "How do MCQs work?",
            answer: "Multiple choice questions (MCQs) are automatically generated for each section. You can submit your answer and see immediate feedback. Click 'Retry' to try again with shuffled options."
        },
        {
            question: "What topics can I learn about?",
            answer: "Our AI can generate courses on virtually any technical or educational topic. From programming languages to data science, from mathematics to engineering concepts."
        },
        {
            question: "How are courses structured?",
            answer: "Each course contains multiple sections. Each section includes detailed text content, headings, and practice MCQs to test your understanding."
        },
        {
            question: "Can I delete a course?",
            answer: "Yes, you can delete courses from your courses list. Simply navigate to the course and look for the delete option in the course details."
        }
    ]

    const resources = [
        {
            icon: BookOpen,
            title: "Getting Started Guide",
            description: "Learn the basics of using the platform",
            action: "Read Guide"
        },
        {
            icon: Video,
            title: "Video Tutorials",
            description: "Watch step-by-step video tutorials",
            action: "Watch Videos"
        },
        {
            icon: MessageCircle,
            title: "Contact Support",
            description: "Get help from our support team",
            action: "Contact Us"
        }
    ]

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link to="/app">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">Help Center</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Find answers to common questions and learn how to use the platform
                    </p>
                </div>

                {/* Resources */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resources.map((resource, idx) => {
                        const Icon = resource.icon
                        return (
                            <div
                                key={idx}
                                className="border border-border rounded-lg p-6 space-y-3 hover:border-primary transition-colors"
                            >
                                <Icon className="h-8 w-8 text-primary" />
                                <h3 className="font-semibold">{resource.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {resource.description}
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    {resource.action}
                                </Button>
                            </div>
                        )
                    })}
                </div>

                {/* FAQs */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-border rounded-lg p-5 space-y-2"
                            >
                                <h3 className="font-semibold text-base">{faq.question}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Help */}
                <div className="border border-border rounded-lg p-6 bg-muted/30">
                    <h3 className="font-semibold mb-2">Still need help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Can't find what you're looking for? Our support team is here to help you.
                    </p>
                    <Button>Contact Support</Button>
                </div>
            </div>
        </div>
    )
}

export default Help
