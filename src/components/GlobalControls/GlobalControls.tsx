import { Box, Button, Typography, IconButton } from '@mui/joy';
import { useState } from 'react';
import LanguageSelectorComponent from '../LanguageSelectorComponent/LanguageSelectorComponent';
import TmpThemeSelectorComponent from '../TmpThemeSelectorComponent/TmpThemeSelectorComponent';
import { useNavigate } from 'react-router';

const GlobalControls = () => {
  const navigate = useNavigate();

  // State for collapsible sections
  const [showLangTheme, setShowLangTheme] = useState(true);
  const [showNavigation, setShowNavigation] = useState(true);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        zIndex: 1500,
        p: 1,
        borderRadius: 'md',
        boxShadow: 'md',
        bgcolor: 'background.surface',
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 200,
      }}
    >
      {/* Language / Theme Section */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography level="h4" sx={{ fontWeight: 'bold' }}>
            Select Language / Theme
          </Typography>
          <IconButton
            size="sm"
            variant="plain"
            onClick={() => setShowLangTheme((prev) => !prev)}
          >
            {showLangTheme ? '−' : '+'}
          </IconButton>
        </Box>
        {showLangTheme && (
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <LanguageSelectorComponent />
            <TmpThemeSelectorComponent />
          </Box>
        )}
      </Box>

      {/* Navigation Section */}
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography level="h3" sx={{ textAlign: 'center' }}>
            Navigation
          </Typography>
          <IconButton
            size="sm"
            variant="plain"
            onClick={() => setShowNavigation((prev) => !prev)}
          >
            {showNavigation ? '−' : '+'}
          </IconButton>
        </Box>
        {showNavigation && (
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="soft"
              color="neutral"
              onClick={() => navigate('/')}
            >
              Homepage
            </Button>
            <Button
              variant="soft"
              color="neutral"
              onClick={() => navigate('/weather')}
            >
              Weather Page (i18n)
            </Button>
            <Button
              variant="soft"
              color="neutral"
              onClick={() => navigate('/colors')}
            >
              Joy Color Showcase
            </Button>
            <Button
              variant="soft"
              color="neutral"
              onClick={() => navigate('/user')}
            >
              User Data Showcase
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GlobalControls;
