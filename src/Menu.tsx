import { useNavigate, useLocation } from 'react-router';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ContactMailRoundedIcon from '@mui/icons-material/ContactMailRounded';
import LanguageSelectorComponent from './components/LanguageSelectorComponent/LanguageSelectorComponent';
import TmpThemeSelectorComponent from './components/TmpThemeSelectorComponent/TmpThemeSelectorComponent';

export default function VerticalMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Home', icon: <HomeRoundedIcon />, path: '/' },
    { label: 'Exams', icon: <InfoRoundedIcon />, path: '/exams' },
    { label: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
    { label: 'Contact', icon: <ContactMailRoundedIcon />, path: '/contact' },
  ];

  return (
    <Box
      sx={{
        height: '100vh',
        width: 240,
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.body',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <List size="lg" sx={{ flex: 1, p: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.label}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 'md',
                '&.Mui-selected': {
                  bgcolor: 'primary.softBg',
                  color: 'primary.plainColor',
                  '&:hover': {
                    bgcolor: 'primary.softHoverBg',
                  },
                },
              }}
            >
              <ListItemDecorator>{item.icon}</ListItemDecorator>
              <ListItemContent>{item.label}</ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
        <LanguageSelectorComponent />
        <TmpThemeSelectorComponent />
      </List>
    </Box>
  );
}
