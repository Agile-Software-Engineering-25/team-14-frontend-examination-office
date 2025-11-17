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

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const {
    addStudentToExam,
    getStudentsByExamId,
    getExternalGroups,
    removeStudentFromExam,
  } = useApi();
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const initialSelectedIdsRef = useRef<Set<string>>(new Set());

  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    if (!open || !exam?.id) return;
    (async () => {
      try {
        const enrolled = await getStudentsByExamId(exam.id);
        initialSelectedIdsRef.current = new Set(enrolled);
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

  useEffect(() => {
    setPage(1);
  }, [selectedGroup, rowsPerPage]);

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

  const filteredStudents = selectedGroup
    ? students.filter((s) => s.cohort === selectedGroup)
    : students;
  const total = filteredStudents.length;
  const totalPages =
    total === 0 ? 0 : Math.ceil(total / Math.max(1, rowsPerPage));
  const start = totalPages === 0 ? 0 : (page - 1) * rowsPerPage;
  const end = totalPages === 0 ? 0 : Math.min(start + rowsPerPage, total);
  const paginatedStudents = filteredStudents.slice(start, end);

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
                  placeholder={t(
                    'pages.exams.addStudents.selectGroup',
                    'Gruppe auswählen…'
                  )}
                  options={groups.map((g) => g.name)}
                  value={selectedGroup}
                  onChange={(_, newValue) => setSelectedGroup(newValue)}
                  sx={{ mb: 2 }}
                />
                <Button size="sm" onClick={toggleSelectAll}>
                  {areAllSelected()
                    ? t('pages.exams.addStudents.deselectAll', 'Alle abwählen')
                    : t('pages.exams.addStudents.selectAll', 'Alle auswählen')}
                </Button>
              </Box>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {paginatedStudents.map((s) => {
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
                        onChange={() => {
                          console.log(
                            '[AddStudentsModal] student JSON:',
                            JSON.stringify(s, null, 2)
                          );
                          toggleStudent(s.uuid);
                        }}
                        label={`${s.firstName} ${s.lastName}${s.matriculationNumber ? ` — ${s.matriculationNumber}` : ''}${alreadyEnrolled ? t('pages.exams.addStudents.alreadyEnrolled', ' (bereits eingeschrieben)') : ''}`}
                      />
                    </li>
                  );
                })}
              </ul>
              {totalPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Button
                    size="sm"
                    variant="plain"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  >
                    Zurück
                  </Button>
                  <Typography level="body-sm">
                    Seite {page} von {totalPages}
                  </Typography>
                  <Button
                    size="sm"
                    variant="plain"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  >
                    Weiter
                  </Button>
                  <Typography level="body-sm">Pro Seite:</Typography>
                  <input
                    type="number"
                    min={1}
                    value={rowsPerPage}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setRowsPerPage(value);
                        setPage(1);
                      }
                    }}
                    style={{
                      width: '60px',
                      textAlign: 'center',
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      padding: '2px 4px',
                    }}
                  />
                </Box>
              )}
            </>
          ) : (
            <p>
              {t(
                'pages.exams.addStudents.noStudents',
                'Keine Studierenden für diese Prüfung vorhanden.'
              )}
            </p>
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
    const initialSet = new Set<string>(latestEnrolled ?? []);
    console.log('[AddStudentsModal] initialSet IDs:', Array.from(initialSet));
    console.log('[AddStudentsModal] currentSet IDs:', Array.from(currentSet));

    const toAdd: string[] = [];
    currentSet.forEach((id) => {
      if (!initialSet.has(id)) toAdd.push(id);
    });
    console.log('[AddStudentsModal] toAdd (nach Vergleich):', toAdd);

    const toRemove: string[] = [];
    initialSet.forEach((id) => {
      if (!currentSet.has(id)) toRemove.push(id);
    });
    console.log('[AddStudentsModal] toRemove:', toRemove);

    try {
      console.log('[AddStudentsModal] Starte Speichern...', {
        toAdd,
        toRemove,
        examId: exam.id,
      });
      setSaving(true);
      const tasks: Promise<unknown>[] = [];
      console.log('toAdd:', toAdd);
      console.log('toRemove:', toRemove);

      toAdd.forEach((sid) =>
        tasks.push(addStudentToExam(sid, String(exam.id)))
      );
      toRemove.forEach((sid) =>
        tasks.push(removeStudentFromExam(sid, String(exam.id)))
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
          toRemove,
          results,
        });
      } else {
        const msg = t(
          'pages.exams.addStudents.saveSuccess',
          'Studierende erfolgreich hinzugefügt/entfernt'
        );
        onSaved?.(true, msg);
        console.log('[AddStudentsModal] Aktualisiert', { toAdd, toRemove });
        console.log('[AddStudentsModal] Speichern erfolgreich abgeschlossen.');
      }
      if (!hasError) {
        const updated = new Set<string>([...Array.from(initialSet), ...toAdd]);
        toRemove.forEach((id) => updated.delete(id));
        initialSelectedIdsRef.current = updated;
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
              (() => {
                const selected = new Set(getSelectedIds());
                const initial = initialSelectedIdsRef.current;
                if (selected.size !== initial.size) return false;
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
