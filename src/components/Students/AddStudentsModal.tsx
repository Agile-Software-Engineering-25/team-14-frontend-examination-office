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

const AddStudentsModal = ({
  open,
  setOpen,
  exam,
}: AddStudentsModalProps) => {
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

  const {
    getStudentsByStudyGroup,
    addStudentToExam,
    removeStudentFromExam,
    getStudentsByExamId,
  } = useApi();
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
                  onClick={() => toggleSelectAll(String(group.id))}
                >
                  {areAllSelected(String(group.id))
                    ? 'Alle abwählen'
                    : 'Alle auswählen'}
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
                        label={`${s.firstName} ${s.lastName}${s.matriculationNumber ? ` — ${s.matriculationNumber}` : ''}`}
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
  const getSelectedIds = () => Array.from(new Set(Object.values(selectedByGroup).flat()));
  const angemeldetCount = getSelectedIds().length;

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
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            {`Angemeldet: ${angemeldetCount}`}
          </Typography>
          <Button
            variant="solid"
            onClick={async () => {
              if (!exam?.id) return;

              const currentSet = new Set(getSelectedIds());
              const initialSet = new Set(initialSelectedIdsRef.current);

              const toAdd: number[] = [];
              const toRemove: number[] = [];

              currentSet.forEach((id) => {
                if (!initialSet.has(id)) toAdd.push(id);
              });
              initialSet.forEach((id) => {
                if (!currentSet.has(id)) toRemove.push(id);
              });

              try {
                setSaving(true);
                const tasks: Promise<any>[] = [];

                // Stelle sicher, dass jede ID genau einmal gesendet wird
                toAdd.forEach((sid) =>
                  tasks.push(addStudentToExam(sid, exam.id as number))
                );
                toRemove.forEach((sid) =>
                  tasks.push(removeStudentFromExam(sid, exam.id as number))
                );

                const results = await Promise.allSettled(tasks);
                const hasError = results.some((r) => r.status === 'rejected');
                if (hasError) {
                  console.error('[AddStudentsModal] Fehler bei Speichern', {
                    toAdd,
                    toRemove,
                    results,
                  });
                } else {
                  console.log('[AddStudentsModal] Aktualisiert', {
                    toAdd,
                    toRemove,
                  });
                }
              } catch (err) {
                console.error(
                  '[AddStudentsModal] Speichern fehlgeschlagen',
                  err
                );
              } finally {
                setSaving(false);
                setOpen(false);
              }
            }}
            disabled={saving || !exam?.id}
          >
            Speichern
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default AddStudentsModal;
