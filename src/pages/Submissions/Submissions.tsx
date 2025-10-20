import { Box, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import SubmissionOverview from "@components/SubmissionsOverview/SubmissionsOverview";

function Submissions() {
  const { t } = useTranslation();
  const { examId } = useParams<{ examId?: string }>();
  const [validExamId, setValidExamId] = useState<string | null>(null);

  useEffect(() => {
    if (examId) {
      setValidExamId(examId);
    }
  }, [examId]);

  if (!validExamId) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography level="body-md" color="danger">
          {t("pages.submissions.invalidExamId", { defaultValue: "Invalid exam ID" })}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 4 }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        {t("pages.submissions.title", { defaultValue: `Submissions for Exam ${examId}` })}
      </Typography>
      <SubmissionOverview examUuid={validExamId} />
    </Box>
  );
}

export default Submissions;
