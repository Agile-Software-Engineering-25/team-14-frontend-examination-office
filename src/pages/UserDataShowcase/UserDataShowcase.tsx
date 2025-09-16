import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/joy';
import useUser from '@/hooks/useUser';
import { useTranslation } from 'react-i18next';

const UserDataShowcase = () => {
  const { t } = useTranslation();
  const user = useUser();

  return (
    <Box  sx={{ padding: 2, maxWidth: 1200, mx: 'auto' }}>
        <Typography level="h1" sx={{ mb: 4, textAlign: 'center' }}>
            User Data Showcase
        </Typography>

        {/* Retrievable User Data */}

        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography level="h2" sx={{ mb: 3 }}>
                    Retrievable User Data
                </Typography>

                <Typography level="body-lg" sx={{ mb: 4, textAlign: 'left' }}>
                    For usage please take a look at the code for this page (see <code>src/pages/UserDataShowcase/UserDataShowcase.tsx</code>). <br />
                    A Docusaurus post will follow soon.
                </Typography>
                
                <Typography level="body-lg" sx={{ mb: 4, textAlign: 'left' }}>
                    {t('pages.home.welcomeMessage', { name: user.getFullName() })}
                </Typography>
                <Typography level="body-lg" sx={{ mb: 4, textAlign: 'left' }}><strong>User ID:</strong> {user.getUserId()}</Typography>
                <Typography level="body-lg" sx={{ mb: 4, textAlign: 'left' }}><strong>E-Mail:</strong> {user.getEmail()}</Typography>
                <Typography level="body-lg" sx={{ mb: 4, textAlign: 'left', wordBreak: 'break-word' }}><strong>Access Token:</strong> {user.getAccessToken()}</Typography>
                <Typography level="body-lg" sx={{ mb: 4, textAlign: 'left' }}>
                    <strong>Has role testabc:</strong> {user.hasRole('testabc') ? 'Yes' : 'No'}
                </Typography>
                <Typography level="body-lg" sx={{ mb: 4, textAlign: 'left' }}>
                    <strong>Has role testdef:</strong> {user.hasRole('testdef') ? 'Yes' : 'No'}
                </Typography>
            </CardContent>
        </Card>
    </Box>
  );
};

export default UserDataShowcase;
