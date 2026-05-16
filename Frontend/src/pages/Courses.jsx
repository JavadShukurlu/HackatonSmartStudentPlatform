import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { coursesService } from '../api/coursesService';
import { useDebounce } from '../hooks/useDebounce';

const Courses = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);

  useEffect(() => {
    let mounted = true;
    coursesService.list().then((list) => {
      if (mounted) { setItems(list); setLoading(false); }
    });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) => c.name.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q)
    );
  }, [items, debounced]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Courses</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Monitor course capacity and availability.</p>
      </div>

      <Card>
        <div className="max-w-sm">
          <Input
            leftIcon={Search}
            placeholder="Search courses or instructors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mt-4 table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Course</th>
                <th>Teacher</th>
                <th>Credits</th>
                <th>Capacity</th>
                <th>Enrolled</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j}><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState title="No courses match" description="Try a different search term." />
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const ratio = c.enrolled / c.capacity;
                  const barTone =
                    ratio >= 1 ? 'bg-rose-500' : ratio >= 0.8 ? 'bg-amber-500' : 'bg-emerald-500';
                  return (
                    <tr key={c.id}>
                      <td className="font-medium text-slate-800 dark:text-slate-100">{c.name}</td>
                      <td className="text-slate-500 dark:text-slate-400">{c.teacher}</td>
                      <td>{c.credits}</td>
                      <td>{c.capacity}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className={`h-full ${barTone}`} style={{ width: `${Math.min(100, ratio * 100)}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{c.enrolled}</span>
                        </div>
                      </td>
                      <td>
                        {c.status === 'full' ? (
                          <Badge tone="danger">Full</Badge>
                        ) : (
                          <Badge tone="success">Available</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Courses;
