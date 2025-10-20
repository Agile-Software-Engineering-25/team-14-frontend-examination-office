import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Button,
  Checkbox,
  Box,
} from '@mui/joy';
import { Accordion } from '@agile-software/shared-components';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import type { Exam } from '@custom-types/exam';
import useApi from '@hooks/useApi';
import type { Student } from '@custom-types/student';

interface AddStudentsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  exam?: Exam | null;
}

const AddStudentsModal = ({ open, setOpen, exam }: AddStudentsModalProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>('all');

  const { addStudentToExam, getStudentsByExamId, getAllStudents } = useApi();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const initialSelectedIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!open || !exam?.id) return;
    (async () => {
      try {
        const enrolled = await getStudentsByExamId(exam.id);
        const ids = (enrolled || []).map((s: Student) => String(s.id));
        initialSelectedIdsRef.current = new Set(ids);
        setSelectedIds([]);
      } catch (e) {
        console.error('[AddStudentsModal] getStudentsByExamId failed', e);
      }
    })();
  }, [open, exam?.id, getStudentsByExamId]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    getAllStudents()
      .then((list) => {
        const arr = Array.isArray(list) ? (list as Student[]) : [];
        arr.sort((a, b) =>
          `${a.lastName ?? ''} ${a.firstName ?? ''}`.localeCompare(
            `${b.lastName ?? ''} ${b.firstName ?? ''}`
          )
        );
        setStudents(arr);
      })
      .catch((err: unknown) => {
        console.error('[AddStudentsModal] load all students failed', err);
        const message =
          err instanceof Error ? err.message : 'Fehler beim Laden';
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [open, getAllStudents]);

  const areAllSelected = () =>
    students.length > 0 && selectedIds.length === students.length;

  const toggleSelectAll = () => {
    if (areAllSelected()) setSelectedIds([]);
    else setSelectedIds(students.map((s) => String(s.id)));
  };

  const toggleStudent = (sid: string) => {
    setSelectedIds((prev) => {
      const set = new Set(prev);
      if (set.has(sid)) set.delete(sid);
      else set.add(sid);
      return Array.from(set);
    });
  };

  const accordionItems = [
    {
      id: 'all',
      header: t(
        'pages.exams.addStudents.header',
        'Studierende zur Prüfung anmelden'
      ),
      children: (
        <div>
          {loading && (
            <p>{t('pages.exams.addStudents.loading', 'Lade Studierende…')}</p>
          )}
          {error && !loading && (
            <p style={{ color: 'var(--joy-palette-danger-600, #b71c1c)' }}>
              {error}
            </p>
          )}
          {!loading && !error && students.length ? (
            <>
              <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                <Button size="sm" onClick={toggleSelectAll}>
                  {areAllSelected()
                    ? t('pages.exams.addStudents.deselectAll', 'Alle abwählen')
                    : t('pages.exams.addStudents.selectAll', 'Alle auswählen')}
                </Button>
              </Box>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {students.map((s) => {
                  const selected = selectedIds.includes(String(s.id));
                  const alreadyEnrolled = initialSelectedIdsRef.current.has(
                    String(s.id)
                  );
                  return (
                    <li
                      key={String(s.id)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        marginBottom: 4,
                        backgroundColor: selected
                          ? 'rgba(66, 165, 245, 0.18)'
                          : alreadyEnrolled
                            ? 'rgba(76, 175, 80, 0.12)'
                            : 'transparent',
                        border: alreadyEnrolled
                          ? '1px solid rgba(76, 175, 80, 0.35)'
                          : '1px solid transparent',
                      }}
                    >
                      <Checkbox
                        checked={selected}
                        onChange={() => toggleStudent(String(s.id))}
                        label={`${s.firstName} ${s.lastName}${s.studentId ? ` — ${s.studentId}` : ''}
                        ${alreadyEnrolled ? t('pages.exams.addStudents.alreadyEnrolled', ' (bereits eingeschrieben)') : ''}`}
                      />
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p>Keine Studierenden für diese Prüfung vorhanden.</p>
          )}
        </div>
      ),
      expanded: expanded === 'all',
      onChange: (isExpanded: boolean) => setExpanded(isExpanded ? 'all' : null),
    },
  ];
  // Helper to get all selected IDs as a flat, deduplicated array
  const getSelectedIds = () => Array.from(new Set(selectedIds));
  const addedToExamCount = initialSelectedIdsRef.current.size;

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        variant="outlined"
        sx={{
          minWidth: '60%',
          maxWidth: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <ModalClose />
        <Typography level="h4">
          {exam
            ? `${t('pages.exams.addStudents.title', 'Prüfung: ')}  ${exam.title}`
            : t('pages.exams.addStudents.title', 'Prüfungsanmeldung')}
        </Typography>
        <Accordion
          items={accordionItems}
          multiple={true}
          defaultExpanded={['all']}
        />
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            {t('pages.exams.addStudents.registeredCount', {
              count: addedToExamCount,
            })}
          </Typography>
          <Button
            variant="solid"
            onClick={async () => {
              const currentSet = new Set(getSelectedIds());
              if (!exam?.id) return;
              const latestEnrolled = await getStudentsByExamId(exam.id);
              console.log('[AddStudentsModal] latestEnrolled:', latestEnrolled);
              const initialSet = new Set<string>(
                (latestEnrolled ?? []).map((s: Student) => String(s.id))
              );
              console.log(
                '[AddStudentsModal] initialSet IDs:',
                Array.from(initialSet)
              );
              console.log(
                '[AddStudentsModal] currentSet IDs:',
                Array.from(currentSet)
              );

              const toAdd: string[] = [];
              currentSet.forEach((id) => {
                if (!initialSet.has(id)) toAdd.push(id);
              });
              console.log('[AddStudentsModal] toAdd (nach Vergleich):', toAdd);

              try {
                console.log('[AddStudentsModal] Starte Speichern...', {
                  toAdd,
                  examId: exam.id,
                });
                setSaving(true);
                const tasks: Promise<unknown>[] = [];

                toAdd.forEach((sid) =>
                  tasks.push(addStudentToExam(sid, String(exam.id)))
                );

                const results = await Promise.allSettled(tasks);
                const hasError = results.some((r) => r.status === 'rejected');
                if (hasError) {
                  console.error('[AddStudentsModal] Fehler bei Speichern', {
                    toAdd,
                    results,
                  });
                } else {
                  console.log('[AddStudentsModal] Aktualisiert', {
                    toAdd,
                  });
                  console.log(
                    '[AddStudentsModal] Speichern erfolgreich abgeschlossen.'
                  );
                }
                if (!hasError) {
                  initialSelectedIdsRef.current = new Set<string>([
                    ...Array.from(initialSet),
                    ...toAdd,
                  ]);
                }
              } catch (err) {
                console.error(
                  '[AddStudentsModal] Speichern fehlgeschlagen',
                  err
                );
                console.log('[AddStudentsModal] Fehlerdetails:', err);
              } finally {
                setSaving(false);
                setOpen(false);
              }
            }}
            disabled={
              saving ||
              !exam?.id ||
              (function () {
                const selected = new Set(getSelectedIds());
                const initial = initialSelectedIdsRef.current;
                if (selected.size === 0) return true;
                for (const id of selected) {
                  if (!initial.has(id)) return false;
                }
                return true;
              })()
            }
          >
            {t('pages.exams.addStudents.save', 'Speichern')}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default AddStudentsModal;
