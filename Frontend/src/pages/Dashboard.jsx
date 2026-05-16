import { useEffect, useState } from 'react';
import { Users, GraduationCap, UserCheck, Megaphone, CalendarDays, PackageSearch, UsersRound } from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import StatCard from '../components/dashboard/StatCard';
import EnrollmentChart from '../components/dashboard/EnrollmentChart';
import GpaChart from '../components/dashboard/GpaChart';
import RecentActivities from '../components/dashboard/RecentActivities';
import LatestStudents from '../components/dashboard/LatestStudents';
import Skeleton from '../components/ui/Skeleton';
import { dashboardService } from '../api/dashboardService';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [gpa, setGpa] = useState([]);
  const [activities, setActivities] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, e, g, a, st] = await Promise.all([
          dashboardService.stats(),
          dashboardService.enrollments(),
          dashboardService.gpa(),
          dashboardService.activities(),
          dashboardService.latestStudents(),
        ]);
        if (!mounted) return;
        setStats(s); setEnrollments(e); setGpa(g); setActivities(a); setStudents(st);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const tiles = [
    { label: 'Total Users',         value: stats?.totalUsers,         icon: Users,         tone: 'brand',   delta: 8  },
    { label: 'Total Students',      value: stats?.totalStudents,      icon: GraduationCap, tone: 'emerald', delta: 12 },
    { label: 'Total Teachers',      value: stats?.totalTeachers,      icon: UserCheck,     tone: 'cyan',    delta: 4  },
    { label: 'Announcements',       value: stats?.totalAnnouncements, icon: Megaphone,     tone: 'fuchsia', delta: 6  },
    { label: 'Events',              value: stats?.totalEvents,        icon: CalendarDays,  tone: 'amber',   delta: 3  },
    { label: 'Lost & Found Posts',  value: stats?.totalLostFound,     icon: PackageSearch, tone: 'rose',    delta: -2 },
    { label: 'Team Finder Posts',   value: stats?.totalTeamFinder,    icon: UsersRound,    tone: 'brand',   delta: 5  },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-300">
          Welcome back — here is what's happening across your campus today.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-7 w-20" />
                <Skeleton className="mt-3 h-3 w-32" />
              </div>
            ))
          : tiles.map((t) => <StatCard key={t.label} {...t} />)}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="Enrollment overview" subtitle="Monthly enrollments vs dropouts" />
          {loading ? <Skeleton className="h-72 w-full" /> : <EnrollmentChart data={enrollments} />}
        </Card>
        <Card>
          <CardHeader title="Grade distribution" subtitle="Across all courses" />
          {loading ? <Skeleton className="h-72 w-full" /> : <GpaChart data={gpa} />}
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader title="Recent activities" subtitle="Latest user actions" />
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <RecentActivities items={activities} />
          )}
        </Card>
        <Card>
          <CardHeader title="Latest registered students" subtitle="Recent sign-ups" />
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <LatestStudents items={students} />
          )}
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
