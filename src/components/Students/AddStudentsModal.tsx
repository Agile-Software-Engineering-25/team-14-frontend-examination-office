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
import { useState, useEffect, useRef, useMemo } from 'react';
import type { Exam } from '@custom-types/exam';
import useApi from '@hooks/useApi';
import type { Student } from '@custom-types/student';

interface AddStudentsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  exam?: Exam | null;
  onSaveSelected?: (ids: number[]) => void;
}

const AddStudentsModal = ({ open, setOpen, exam }: AddStudentsModalProps) => {
  const { t } = useTranslation();
  const groups = useMemo(
    () => [
      { id: 1, label: 'BIN-T23-F-1' },
      { id: 2, label: 'BIN-T23-F-2' },
      { id: 3, label: 'BIN-T23-F-3' },
      { id: 4, label: 'BIN-T23-F-4' },
    ],
    []
  );
  const [expanded, setExpanded] = useState<string | null>(String(groups[0].id));

  const { getStudentsByStudyGroup, addStudentToExam, getStudentsByExamId } =
    useApi();
  const [studentsByGroup, setStudentsByGroup] = useState<
    Record<string, Student[]>
  >({});
  const [loadingByGroup, setLoadingByGroup] = useState<Record<string, boolean>>(
    {}
  );
  const [errorByGroup, setErrorByGroup] = useState<
    Record<string, string | null>
  >({});

  const [selectedByGroup, setSelectedByGroup] = useState<
    Record<string, number[]>
  >({});
  const [saving, setSaving] = useState(false);
  const initialSelectedIdsRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    if (!open || !exam?.id) return;
    (async () => {
      try {
        const enrolled = await getStudentsByExamId(exam.id);
        // build selection map per group id
        const next: Record<string, number[]> = {};
        groups.forEach(({ id }) => (next[String(id)] = []));
        const flatIds: number[] = [];
        (enrolled || []).forEach((s: any) => {
          const gid = String(s.studyGroup ?? s.studyGroupId ?? '');
          if (gid && next[gid]) next[gid].push(s.id);
          flatIds.push(s.id);
        });
        initialSelectedIdsRef.current = new Set(flatIds);
        setSelectedByGroup(next);
      } catch (e) {
        console.error('[AddStudentsModal] getStudentsByExamId failed', e);
      }
    })();
  }, [open, exam?.id, getStudentsByExamId, groups]);

  const areAllSelected = (gid: string) => {
    const total = studentsByGroup[gid]?.length ?? 0;
    const selected = selectedByGroup[gid]?.length ?? 0;
    return total > 0 && selected === total;
  };

  const toggleSelectAll = (gid: string) => {
    const allIds = (studentsByGroup[gid] ?? []).map((s) => s.id);
    setSelectedByGroup((prev) => ({
      ...prev,
      [gid]: areAllSelected(gid) ? [] : allIds,
    }));
  };

  const toggleStudent = (gid: string, sid: number) => {
    setSelectedByGroup((prev) => {
      const set = new Set(prev[gid] ?? []);
      if (set.has(sid)) set.delete(sid);
      else set.add(sid);
      return { ...prev, [gid]: Array.from(set) };
    });
  };

  useEffect(() => {
    if (!open) return;
    groups.forEach(({ id }) => {
      const key = String(id);
      if (studentsByGroup[key] || loadingByGroup[key]) return;

      setLoadingByGroup((s) => ({ ...s, [key]: true }));
      setErrorByGroup((s) => ({ ...s, [key]: null }));

      getStudentsByStudyGroup(key)
        .then((data) => {
          setStudentsByGroup((s) => ({ ...s, [key]: data }));
        })
        .catch((err: any) => {
          setErrorByGroup((s) => ({
            ...s,
            [key]: err?.message ?? 'Fehler beim Laden',
          }));
        })
        .finally(() => {
          setLoadingByGroup((s) => ({ ...s, [key]: false }));
        });
    });
  }, [open, groups, getStudentsByStudyGroup]);

  const accordionItems = groups.map((group) => ({
    id: String(group.id),
    header: `Gruppe: ${group.label}`,
    children: (
      <div>
        {loadingByGroup[String(group.id)] && <p>Lade Studierende…</p>}
        {errorByGroup[String(group.id)] &&
          !loadingByGroup[String(group.id)] && (
            <p style={{ color: 'var(--joy-palette-danger-600, #b71c1c)' }}>
              {errorByGroup[String(group.id)]}
            </p>
          )}
        {!loadingByGroup[String(group.id)] &&
          !errorByGroup[String(group.id)] &&
          (studentsByGroup[String(group.id)]?.length ? (
            <>
              <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                <Button
                  size="sm"
                  onClick={() => {
                    const gid = String(group.id);
                    const allIds = (studentsByGroup[gid] ?? []).map(
                      (s) => s.id
                    );
                    setSelectedByGroup((prev) => ({
                      ...prev,
                      [gid]: allIds,
                    }));
                  }}
                >
                  Alle auswählen
                </Button>
              </Box>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {studentsByGroup[String(group.id)].map((s) => {
                  const selected = (
                    selectedByGroup[String(group.id)] ?? []
                  ).includes(s.id);
                  return (
                    <li
                      key={s.id}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        marginBottom: 4,
                        backgroundColor: selected
                          ? 'rgba(66, 165, 245, 0.18)'
                          : 'transparent',
                      }}
                    >
                      <Checkbox
                        checked={selected}
                        onChange={() => toggleStudent(String(group.id), s.id)}
                        label={`${s.firstName} ${s.lastName}${s.studentId ? ` — ${s.studentId}` : ''}`}
                      />
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <p>Keine Studierenden in dieser Gruppe.</p>
          ))}
      </div>
    ),
    expanded: expanded === String(group.id),
    onChange: (isExpanded: boolean) =>
      setExpanded(isExpanded ? String(group.id) : null),
  }));
  console.log('ExamID', exam?.id);
  // Helper to get all selected IDs as a flat, deduplicated array
  const getSelectedIds = () =>
    Array.from(new Set(Object.values(selectedByGroup).flat()));
  const addedToExamCount = getSelectedIds().length;

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
            ? `${t('pages.exams.addStudents.title', 'Studierende hinzufügen')} — ${exam.title}`
            : t('pages.exams.addStudents.title', 'Studierende hinzufügen')}
        </Typography>
        <Accordion
          items={accordionItems}
          multiple={true}
          defaultExpanded={[String(groups[0].id)]}
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
            {`Hinzugefügt: ${addedToExamCount}`}
          </Typography>
          <Button
            variant="solid"
            onClick={async () => {
              const currentSet = new Set(getSelectedIds());
              if (!exam?.id) return;
              const latestEnrolled = await getStudentsByExamId(exam.id);
              console.log('[AddStudentsModal] latestEnrolled:', latestEnrolled);
              const initialSet = new Set<number>(
                (latestEnrolled ?? []).map((s: any) => s.id)
              );
              console.log(
                '[AddStudentsModal] initialSet IDs:',
                Array.from(initialSet)
              );
              console.log(
                '[AddStudentsModal] currentSet IDs:',
                Array.from(currentSet)
              );

              const toAdd: number[] = [];
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
                const tasks: Promise<any>[] = [];

                toAdd.forEach((sid) =>
                  tasks.push(addStudentToExam(sid, exam.id as number))
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
                  initialSelectedIdsRef.current = new Set<number>([
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
            Speichern
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default AddStudentsModal;
