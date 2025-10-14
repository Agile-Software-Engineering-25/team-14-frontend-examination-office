import { Modal, ModalClose, ModalDialog, Typography } from '@mui/joy';
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
}

const AddStudentsModal = ({ open, setOpen, exam }: AddStudentsModalProps) => {
  const { t } = useTranslation();
  const groups = [
    { id: 1, label: 'BIN-T23-F-1' },
    { id: 2, label: 'BIN-T23-F-2' },
    { id: 3, label: 'BIN-T23-F-3' },
    { id: 4, label: 'BIN-T23-F-4' },
  ];
  const [expanded, setExpanded] = useState<string | null>(String(groups[0].id));

  const { getStudentsByStudyGroup } = useApi();
  const [studentsByGroup, setStudentsByGroup] = useState<Record<string, Student[]>>({});
  const [loadingByGroup, setLoadingByGroup] = useState<Record<string, boolean>>({});
  const [errorByGroup, setErrorByGroup] = useState<Record<string, string | null>>({});

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
          setErrorByGroup((s) => ({ ...s, [key]: err?.message ?? 'Fehler beim Laden' }));
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
        {errorByGroup[String(group.id)] && !loadingByGroup[String(group.id)] && (
          <p style={{ color: 'var(--joy-palette-danger-600, #b71c1c)' }}>
            {errorByGroup[String(group.id)]}
          </p>
        )}
        {!loadingByGroup[String(group.id)] && !errorByGroup[String(group.id)] && (
          studentsByGroup[String(group.id)]?.length ? (
            <ul>
              {studentsByGroup[String(group.id)].map((s) => (
                <li key={s.id}>
                  {s.firstName} {s.lastName}
                  {s.matriculationNumber ? ` — ${s.matriculationNumber}` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>Keine Studierenden in dieser Gruppe.</p>
          )
        )}
      </div>
    ),
    expanded: expanded === String(group.id),
    onChange: (isExpanded: boolean) => setExpanded(isExpanded ? String(group.id) : null),
  }));

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
      </ModalDialog>
    </Modal>
  );
};

export default AddStudentsModal;
