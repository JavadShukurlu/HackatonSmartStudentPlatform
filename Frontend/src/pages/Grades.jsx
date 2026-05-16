import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card';
import Combobox from '../components/ui/Combobox';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { gradesService } from '../api/gradesService';
import { usersService } from '../api/usersService';
import { coursesService } from '../api/coursesService';
import { useToast } from '../hooks/useToast';
import { ROLES, PAGE_SIZE_DEFAULT } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { inRange, required } from '../utils/validators';

const scoreToBadge = (s) =>
  s >= 85 ? 'success' : s >= 70 ? 'info' : s >= 60 ? 'warning' : 'danger';

const Grades = () => {
  const { notify } = useToast();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({ studentId: '', courseId: '', score: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [g, u, c] = await Promise.all([
        gradesService.list(),
        usersService.list(),
        coursesService.list(),
      ]);
      setGrades(g);
      setStudents(u.filter((x) => x.role === ROLES.STUDENT));
      setCourses(c);
    } catch (e) {
      notify(e.message, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const initial = (name = '') =>
    name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';

  const studentOpts = useMemo(
    () => students.map((s) => ({
      value: s.id,
      label: s.fullName,
      hint: s.email,
      icon: (
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full
                          bg-gradient-to-br from-brand-400 to-accent-400 text-[11px] font-semibold text-white">
          {initial(s.fullName)}
        </span>
      ),
    })),
    [students]
  );
  const courseOpts = useMemo(
    () => courses.map((c) => ({
      value: c.id,
      label: c.name,
      hint: c.code,
      icon: (
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg
                          bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300">
          <BookOpen size={14} />
        </span>
      ),
    })),
    [courses]
  );

  const validate = () => {
    const e = {};
    if (!required(form.studentId)) e.studentId = 'Required';
    if (!required(form.courseId)) e.courseId = 'Required';
    if (!inRange(form.score, 0, 100)) e.score = 'Score must be between 0 and 100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const student = students.find((s) => s.id === form.studentId);
      const course = courses.find((c) => c.id === form.courseId);
      const created = await gradesService.create({
        studentId: form.studentId,
        studentName: student?.fullName,
        courseId: form.courseId,
        courseName: course?.name,
        score: Number(form.score),
      });
      setGrades((prev) => [created, ...prev]);
      setForm({ studentId: '', courseId: '', score: '' });
      notify('Grade added', { type: 'success' });
    } catch (err) {
      notify(err.message, { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    try {
      await gradesService.remove(id);
      setGrades((prev) => prev.filter((g) => g.id !== id));
      notify('Grade removed', { type: 'success' });
    } catch (e) {
      notify(e.message, { type: 'error' });
    }
  };

  const pageCount = Math.max(1, Math.ceil(grades.length / PAGE_SIZE_DEFAULT));
  const paged = grades.slice((page - 1) * PAGE_SIZE_DEFAULT, page * PAGE_SIZE_DEFAULT);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Grades</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Add and review student grades.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-1">
          <CardHeader title="Add grade" subtitle="Assign a score to a student" />
          <form onSubmit={onSubmit} className="space-y-3">
            <Combobox
              label="Student"
              value={form.studentId}
              onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
              options={studentOpts}
              error={errors.studentId}
              placeholder="Select student"
            />
            <Combobox
              label="Course"
              value={form.courseId}
              onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
              options={courseOpts}
              error={errors.courseId}
              placeholder="Select course"
            />
            <Input
              label="Score (0–100)"
              min={0}
              max={100}
              value={form.score}
              onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
              error={errors.score}
              placeholder="e.g. 87"
            />
            <Button type="submit" leftIcon={Plus} loading={submitting} className="w-full">
              Add grade
            </Button>
          </form>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="All grades" subtitle={`${grades.length} entries`} />
          <div className="table-wrap">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j}><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState title="No grades yet" description="Add your first grade using the form on the left." />
                    </td>
                  </tr>
                ) : (
                  paged.map((g) => (
                    <tr key={g.id}>
                      <td className="font-medium">{g.studentName}</td>
                      <td className="text-slate-500 dark:text-slate-400">{g.courseName}</td>
                      <td><Badge tone={scoreToBadge(g.score)}>{g.score}</Badge></td>
                      <td className="text-slate-500 dark:text-slate-400">{formatDate(g.date)}</td>
                      <td>
                        <div className="flex justify-end pr-3">
                          <button
                            onClick={() => onDelete(g.id)}
                            className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                            aria-label="Delete grade"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </Card>
      </div>
    </div>
  );
};

export default Grades;
