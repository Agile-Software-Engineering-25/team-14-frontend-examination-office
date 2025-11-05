import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Button,
  Checkbox,
  Box,
  Autocomplete,
} from '@mui/joy';
import { Accordion } from '@agile-software/shared-components';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import type { Exam } from '@custom-types/exam';
import useApi from '@hooks/useApi';
import type { Student } from '@custom-types/student';
import type { StudentGroup } from '@/@custom-types/studentgroup';

interface AddStudentsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  exam?: Exam | null;
  onSaved?: (success: boolean, message?: string) => void;
}

const AddStudentsModal = ({
  open,
  setOpen,
  exam,
  onSaved,
}: AddStudentsModalProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>('all');

  const { addStudentToExam, getStudentsByExamId, getExternalGroups } = useApi();
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const initialSelectedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!open || !exam?.id) return;
    (async () => {
      try {
        const enrolled = await getStudentsByExamId(exam.id);
        const ids = (enrolled || []).map((s: Student) => s.uuid);
        initialSelectedIdsRef.current = new Set(ids);
        setSelectedIds([]);
      } catch (e) {
        console.error('[AddStudentsModal] getStudentsByExamId failed', e);
      }
    })();
  }, [open, exam?.id, getStudentsByExamId]);

  useEffect(() => {
    if (!open) return;
    getExternalGroups(exam?.id)
      .then((g) => {
        setGroups(g);
      })
      .catch((err) => {
        console.error('[AddStudentsModal] getExternalGroupNames failed', err);
        setError('Failed to fetch Student Groups.');
      });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const arr = groups.flatMap((g) => g.students);
    arr.sort((a, b) =>
      `${a.lastName ?? ''} ${a.firstName ?? ''}`.localeCompare(
        `${b.lastName ?? ''} ${b.firstName ?? ''}`
      )
    );
    setStudents(arr);
    setSelectedIds(arr.filter((s) => s.enlisted).map((s) => s.uuid));
    setLoading(false);
  }, [groups]);

  const areAllSelected = () =>
    students.length > 0 && selectedIds.length === students.length;

  const toggleSelectAll = () => {
    if (areAllSelected()) setSelectedIds([]);
    else setSelectedIds(students.map((s) => s.uuid));
  };

  const toggleStudent = (sid: string) => {
    setSelectedIds((prev) => {
      const set = new Set(prev);
      if (set.has(sid)) set.delete(sid);
      else set.add(sid);
      return Array.from(set);
    });
  };
  //console.log(groupNames);
  console.log(
    '[AddStudentsModal] already enrolled:',
    initialSelectedIdsRef.current
  );
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
              <Box
                sx={{ mb: 1, display: 'flex', gap: 1, flexDirection: 'column' }}
              >
                <Autocomplete
                  placeholder="Nach Studi Gruppe suchen…"
                  options={groups.map((g) => g.name)}
                />
                <Button size="sm" onClick={toggleSelectAll}>
                  {areAllSelected()
                    ? t('pages.exams.addStudents.deselectAll', 'Alle abwählen')
                    : t('pages.exams.addStudents.selectAll', 'Alle auswählen')}
                </Button>
              </Box>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {students.map((s) => {
                  const selected = selectedIds.includes(s.uuid);
                  const alreadyEnrolled = initialSelectedIdsRef.current.has(
                    s.uuid
                  );
                  return (
                    <li
                      key={s.uuid}
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
                        onChange={() => toggleStudent(s.uuid)}
                        label={`${s.firstName} ${s.lastName}${s.matriculationNumber ? ` — ${s.matriculationNumber}` : ''}
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

  const handleSave = async () => {
    const currentSet = new Set(getSelectedIds());
    if (!exam?.id) return;
    const latestEnrolled = await getStudentsByExamId(exam.id);
    console.log('[AddStudentsModal] latestEnrolled:', latestEnrolled);
    const initialSet = new Set<string>(
      (latestEnrolled ?? []).map((s: Student) => s.uuid)
    );
    console.log('[AddStudentsModal] initialSet IDs:', Array.from(initialSet));
    console.log('[AddStudentsModal] currentSet IDs:', Array.from(currentSet));

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
        const msg = t(
          'pages.exams.addStudents.saveError',
          'Fehler beim Speichern'
        );
        onSaved?.(false, msg);
        console.error('[AddStudentsModal] Fehler bei Speichern', {
          toAdd,
          results,
        });
      } else {
        const msg = t(
          'pages.exams.addStudents.saveSuccess',
          'Studierende erfolgreich hinzugefügt'
        );
        onSaved?.(true, msg);
        console.log('[AddStudentsModal] Aktualisiert', { toAdd });
        console.log('[AddStudentsModal] Speichern erfolgreich abgeschlossen.');
      }
      if (!hasError) {
        initialSelectedIdsRef.current = new Set<string>([
          ...Array.from(initialSet),
          ...toAdd,
        ]);
      }
    } catch (err) {
      console.error('[AddStudentsModal] Speichern fehlgeschlagen', err);
      console.log('[AddStudentsModal] Fehlerdetails:', err);
    } finally {
      setSaving(false);
      setOpen(false);
    }
  };

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
            onClick={handleSave}
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
