import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, User, Mail, Calendar, Award, BookOpen } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import useStore from '../store/index.js'

const Profile = () => {
    const { user } = useStore()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    })

    const handleSave = () => {
        // TODO: Implement profile update API call
        console.log('Saving profile:', formData)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        })
        setIsEditing(false)
    }

    // Mock stats - replace with actual data from store
    const stats = [
        { icon: BookOpen, label: 'Courses Enrolled', value: '12' },
        { icon: Award, label: 'Courses Completed', value: '7' },
        { icon: Calendar, label: 'Days Active', value: '45' }
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

                {/* Profile Header */}
                <div className="flex items-start gap-6">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-12 w-12 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h1 className="text-3xl font-bold">{user?.name || 'User Profile'}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={idx}
                                className="border border-border rounded-lg p-6 space-y-2"
                            >
                                <Icon className="h-6 w-6 text-primary" />
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        )
                    })}
                </div>

                {/* Profile Information */}
                <div className="border border-border rounded-lg p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Profile Information</h2>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)} variant="outline">
                                Edit Profile
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            {isEditing ? (
                                <Input
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    {user?.name || 'Not set'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            {isEditing ? (
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    placeholder="Enter your email"
                                />
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    {user?.email || 'Not set'}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Member Since</label>
                            <div className="text-sm text-muted-foreground">
                                {new Date().toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex gap-2 pt-4 border-t border-border">
                            <Button onClick={handleSave}>Save Changes</Button>
                            <Button onClick={handleCancel} variant="outline">
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                {/* Account Actions */}
                <div className="border border-border rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-bold">Account Actions</h2>
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                            Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
