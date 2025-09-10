import LanguageSelectorComponent from "@/components/LanguageSelectorComponent/LanguageSelectorComponent";
import { 
  Box, 
  Button,
  Typography
} from "@mui/joy";
import { useState } from "react";
import AddExamModal from "./AddExamModal";
import EditExamModal from "./EditExamModal";
import { useTranslation } from "react-i18next";


const mockExam = {
  id: 1,
  title: "Kickflip Thesis",
  moduleCode: "KFTA23",
  examDate: "2026-01-01T00:01",
  room: "-",
  examType: "PROJEKT",
  semester: "5",
  ects: 30,
  maxPoints: 1234,
  duration: 4,
  attemptNumber: 1,
  fileUploadRequired: true,
  tools: [],
}

const ExamCreationModal = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Box sx={{ padding: 2, maxWidth: 700, mx: "auto" }}>
      <Typography level="h4">Prüfungskomponenten</Typography>
      <Button onClick={() => setAddModalOpen(true)} sx={{ mt: 2 }}>
        {t("pages.addExam.button")}
      </Button>
      <Button onClick={()=> setEditModalOpen(true)} sx={{ mt: 2 }}>
        {t("pages.editExam.button")}
      </Button>

      <AddExamModal open={addModalOpen} setOpen={setAddModalOpen} onAdd={(url: string)=>{console.log('added', url)}} />
      <EditExamModal open={editModalOpen} setOpen={setEditModalOpen} onSave={(exam)=>{console.log("Saving exam", exam)}} exam={mockExam} />

      <LanguageSelectorComponent />
    </Box>
  );
};

export default ExamCreationModal;
