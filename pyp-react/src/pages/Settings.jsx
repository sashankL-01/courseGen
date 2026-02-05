import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Settings as SettingsIcon, Bell, Palette, Shield, Database } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'

const Settings = () => {
    const [notifications, setNotifications] = useState({
        email: true,
        courseUpdates: true,
        weeklyDigest: false,
        newFeatures: true
    })

    const [preferences, setPreferences] = useState({
        theme: 'system',
        language: 'en',
        autoPlay: false
    })

    const settingSections = [
        {
            icon: Bell,
            title: "Notifications",
            description: "Manage your notification preferences",
            settings: [
                {
                    key: 'email',
                    label: 'Email Notifications',
                    description: 'Receive email updates about your courses'
                },
                {
                    key: 'courseUpdates',
                    label: 'Course Updates',
                    description: 'Get notified when courses are updated'
                },
                {
                    key: 'weeklyDigest',
                    label: 'Weekly Digest',
                    description: 'Receive a weekly summary of your progress'
                },
                {
                    key: 'newFeatures',
                    label: 'New Features',
                    description: 'Stay informed about new platform features'
                }
            ]
        }
    ]

    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

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
                        <SettingsIcon className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold">Settings</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Notifications */}
                {settingSections.map((section, idx) => {
                    const Icon = section.icon
                    return (
                        <div key={idx} className="border border-border rounded-lg p-6 space-y-6">
                            <div className="flex items-center gap-3">
                                <Icon className="h-6 w-6 text-primary" />
                                <div>
                                    <h2 className="text-xl font-bold">{section.title}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {section.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {section.settings.map((setting, settingIdx) => (
                                    <div
                                        key={settingIdx}
                                        className="flex items-start justify-between py-3 border-b border-border last:border-0"
                                    >
                                        <div className="space-y-1">
                                            <div className="font-medium">{setting.label}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {setting.description}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle(setting.key)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[setting.key]
                                                    ? 'bg-primary'
                                                    : 'bg-muted'
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[setting.key]
                                                        ? 'translate-x-6'
                                                        : 'translate-x-1'
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

                {/* Appearance */}
                <div className="border border-border rounded-lg p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <Palette className="h-6 w-6 text-primary" />
                        <div>
                            <h2 className="text-xl font-bold">Appearance</h2>
                            <p className="text-sm text-muted-foreground">
                                Customize how the platform looks
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Theme</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['light', 'dark', 'system'].map((theme) => (
                                    <button
                                        key={theme}
                                        onClick={() => setPreferences({ ...preferences, theme })}
                                        className={`p-3 rounded-lg border text-sm capitalize ${preferences.theme === theme
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        {theme}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy & Security */}
                <div className="border border-border rounded-lg p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-primary" />
                        <div>
                            <h2 className="text-xl font-bold">Privacy & Security</h2>
                            <p className="text-sm text-muted-foreground">
                                Manage your privacy and security settings
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                            Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            Two-Factor Authentication
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            Privacy Settings
                        </Button>
                    </div>
                </div>

                {/* Data Management */}
                <div className="border border-border rounded-lg p-6 space-y-6">
                    <div className="flex items-center gap-3">
                        <Database className="h-6 w-6 text-primary" />
                        <div>
                            <h2 className="text-xl font-bold">Data Management</h2>
                            <p className="text-sm text-muted-foreground">
                                Manage your data and account
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                            Download Your Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            Clear Cache
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-destructive hover:text-destructive"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
