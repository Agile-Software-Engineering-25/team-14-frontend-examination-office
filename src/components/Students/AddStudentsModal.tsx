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
import { useState, useEffect } from 'react';
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
  onSaveSelected,
}: AddStudentsModalProps) => {
  const { t } = useTranslation();
  const groups = [
    { id: 1, label: 'BIN-T23-F-1' },
    { id: 2, label: 'BIN-T23-F-2' },
    { id: 3, label: 'BIN-T23-F-3' },
    { id: 4, label: 'BIN-T23-F-4' },
  ];
  const [expanded, setExpanded] = useState<string | null>(String(groups[0].id));

  const { getStudentsByStudyGroup, addStudentToExam } = useApi();
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
  }, [open, groups, getStudentsByStudyGroup, studentsByGroup, loadingByGroup]);

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
  // Helper to get all selected IDs as a flat array
  const getSelectedIds = () => Object.values(selectedByGroup).flat();

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
          sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
        >
          <Button
            variant="solid"
            onClick={async () => {
              const ids = getSelectedIds();
              if (!exam?.id || ids.length === 0) return;
              try {
                setSaving(true);
                const results = await Promise.allSettled(
                  ids.map((sid) => addStudentToExam(sid, exam.id as number))
                );
                const failed = results
                  .map((r, idx) => (r.status === 'rejected' ? ids[idx] : null))
                  .filter((v): v is number => v !== null);
                if (failed.length > 0) {
                  console.error('[AddStudentsModal] Fehler bei IDs:', failed);
                } else {
                  console.log(
                    '[AddStudentsModal] Erfolgreich hinzugefügt:',
                    ids
                  );
                }
              } catch (err) {
                console.error('[AddStudentsModal] addStudentToExam error', err);
              } finally {
                setSaving(false);
                setOpen(false);
              }
            }}
            disabled={saving || !exam?.id || getSelectedIds().length === 0}
          >
            Speichern
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default AddStudentsModal;
