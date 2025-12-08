import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Plus,
    Video,
    Calendar,
    Loader2,
    AlertCircle,
    Trophy,
    TrendingUp,
    ArrowUpRight,
    GraduationCap,
    BookOpen
} from 'lucide-react'
import { useTRPC } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { authClient } from '@/lib/auth-client'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'


export const Route = createFileRoute('/dashboard')({
    component: RouteComponent,
})

function RouteComponent() {
    const trpc = useTRPC()
    const { data: meetings, isLoading, error } = useQuery(trpc.meeting.getMeetings.queryOptions())
    const { data: session } = authClient.useSession()

    const heroName = session?.user.name?.split(' ')[0] || 'Explorer'
    const stats = useMemo(() => {
        if (!meetings) return { total: 0, thisWeek: 0, prevWeek: 0, uniqueDays: 0, activeDaysThisWeek: 0 }

        const now = new Date()
        const startOfThisWeek = new Date()
        startOfThisWeek.setDate(now.getDate() - 7)
        const startOfPrevWeek = new Date()
        startOfPrevWeek.setDate(now.getDate() - 14)
        const endOfPrevWeek = new Date()
        endOfPrevWeek.setDate(now.getDate() - 7)

        const thisWeekMeetings = meetings.filter(m => {
            const created = new Date(m.createdAt.toString())
            return created >= startOfThisWeek
        })

        const prevWeekMeetings = meetings.filter(m => {
            const created = new Date(m.createdAt.toString())
            return created >= startOfPrevWeek && created < endOfPrevWeek
        })

        const uniqueDays = new Set(meetings.map(m => new Date(m.createdAt.toString()).toDateString())).size
        const activeDaysThisWeek = new Set(thisWeekMeetings.map(m => new Date(m.createdAt.toString()).toDateString())).size

        return {
            total: meetings.length,
            thisWeek: thisWeekMeetings.length,
            prevWeek: prevWeekMeetings.length,
            uniqueDays,
            activeDaysThisWeek,
        }
    }, [meetings])

    const recentMeetings = useMemo(() => {
        if (!meetings) return []
        return [...meetings]
            .sort((a, b) => new Date(b.createdAt.toString()).getTime() - new Date(a.createdAt.toString()).getTime())
            .slice(0, 3)
    }, [meetings])

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-background overflow-hidden">

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-primary/10 via-secondary/20 to-background/80 p-6 md:p-8 shadow-lg animate-fade-in">
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--primary)_0,_transparent_55%)]" />
                        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between relative z-10">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-semibold text-primary border border-primary/30">
                                    Personalized learning HQ
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                    Welcome back, {heroName}! Ready to teach & learn?
                                </h1>
                                <p className="text-muted-foreground max-w-2xl">
                                    Plan live classes, track learner progress, and drop quick learning resources. Everything you need to keep students engaged.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
                                        <Link to="/meetings">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Launch a live class
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link to="/recordings">
                                            <Video className="mr-2 h-4 w-4" />
                                            Share a lesson recording
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full md:w-72">
                                <Card className="border-border/60 shadow-md bg-background/70 backdrop-blur">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                            Learning health
                                        </CardTitle>
                                        <CardDescription>Activity this week</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Classes this week</span>
                                            <Badge variant="secondary">{stats.thisWeek}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Total classes</span>
                                            <span className="font-semibold">{stats.total}</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all"
                                                style={{ width: `${stats.total ? Math.min(100, Math.round((stats.thisWeek / stats.total) * 100)) : 0}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Keep the streak going by scheduling your next class today.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Loading stats...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                            <p className="text-destructive font-semibold">Failed to load data</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-3">
                                <StatsCard
                                    title="Total Classes"
                                    value={stats.total}
                                    trend={stats.thisWeek}
                                    icon={Trophy}
                                    delay={100}
                                />
                                <StatsCard
                                    title="Classes This Week"
                                    value={stats.thisWeek}
                                    trend={Math.max(stats.thisWeek - stats.prevWeek, 0)}
                                    icon={GraduationCap}
                                    delay={200}
                                />
                                <StatsCard
                                    title="Active Teaching Days"
                                    value={stats.uniqueDays}
                                    trend={stats.activeDaysThisWeek}
                                    icon={BookOpen}
                                    delay={300}
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
                                <Card className="md:col-span-4 border-border/60 shadow-sm animate-fade-in [animation-delay:400ms]">
                                    <CardHeader>
                                        <CardTitle>Recent Classes</CardTitle>
                                        <CardDescription>Latest learning sessions you or your team hosted.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {meetings && meetings.length === 0 ? (
                                            <div className="text-center py-10">
                                                <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Trophy className="w-8 h-8 text-muted-foreground/50" />
                                                </div>
                                                <h3 className="text-lg font-medium">No classes yet</h3>
                                                <p className="text-muted-foreground text-sm mt-1 mb-4">Start your first session to see stats here.</p>
                                                <Button variant="outline" asChild>
                                                    <Link to="/meetings">Create Class</Link>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {recentMeetings.map((meeting) => (
                                                    <div key={meeting.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card hover:bg-accent/5 transition-colors group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                <Video className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">{meeting.name}</p>
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Calendar className="h-3 w-3" />
                                                                    {new Date(meeting.createdAt.toString()).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link to="/meeting/$uuid" params={{ uuid: meeting.id }}>
                                                                <ArrowUpRight className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="md:col-span-3 space-y-6 animate-fade-in [animation-delay:500ms]">
                                    <Card className="border-none shadow-md overflow-hidden relative bg-gradient-to-br from-primary/10 via-background to-secondary/10">
                                        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_30%_20%,_var(--primary)_0,_transparent_35%)]" />
                                        <CardHeader>
                                            <CardTitle className="text-foreground flex items-center gap-2">
                                                Quick start
                                            </CardTitle>
                                            <CardDescription className="text-foreground/70">Guide learners or set up your next cohort.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3 relative z-10">
                                                {[
                                                    { label: 'Plan a live class', badge: 'Teacher', href: '/meetings' },
                                                    { label: 'Upload a lesson recording', badge: 'Resource', href: '/recordings' },
                                                    { label: 'Review learner questions', badge: 'Feedback', href: '/meeting/$uuid' },
                                                ].map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-background/60 backdrop-blur-md p-3 rounded-lg border border-border/60 hover:border-primary/40 transition-colors">
                                                        <div className="flex items-center gap-2 text-sm font-medium">
                                                            <Badge variant="secondary">{item.badge}</Badge>
                                                            <span>{item.label}</span>
                                                        </div>
                                                        <Button asChild size="sm" variant="ghost">
                                                            <Link to={item.href}>
                                                                <ArrowUpRight className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/60">
                                        <CardHeader>
                                            <CardTitle>Learning playlists</CardTitle>
                                            <CardDescription>Create small bundles to keep learners on track.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid sm:grid-cols-2 gap-3">
                                            {[
                                                { title: 'Fundamentals', desc: 'Warm-up lessons and foundational theory.', tag: 'Beginner' },
                                                { title: 'Workshop mode', desc: 'Hands-on labs to practice together.', tag: 'Live' },
                                                { title: 'Assess & reflect', desc: 'Quizzes, feedback, and follow-ups.', tag: 'Assessment' },
                                                { title: 'Teacher toolkit', desc: 'Templates, rubrics, and slides.', tag: 'Resource' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="p-3 rounded-lg border border-border/60 bg-card hover:bg-accent/5 transition-colors flex flex-col gap-2">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-semibold">{item.title}</p>
                                                        <Badge variant="outline" className="text-xs">{item.tag}</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                                    <Button asChild size="sm" variant="ghost" className="self-start">
                                                        <Link to="/meetings">
                                                            Open
                                                            <ArrowUpRight className="h-3 w-3 ml-1" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

function StatsCard({ title, value, trend, icon: Icon, delay, suffix = '' }: { title: string, value: number, trend: number, icon: any, delay: number, suffix?: string }) {
    return (
        <Card className={`overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in`} style={{ animationDelay: `${delay}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}{suffix}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    {trend > 0 ? (
                        <span className="text-primary flex items-center mr-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{trend}
                        </span>
                    ) : (
                        <span className="text-muted-foreground mr-1">0</span>
                    )}
                    <span className="opacity-70">this week</span>
                </p>
            </CardContent>
        </Card>
    )
}

