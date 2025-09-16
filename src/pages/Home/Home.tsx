import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  Input,
  Textarea,
  Select,
  Option,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  LinearProgress,
  CircularProgress,
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemDecorator,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Table,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionGroup,
  Stack,
  Grid,
} from '@mui/joy';
import { useState } from 'react';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(30);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchChecked, setSwitchChecked] = useState(true);

  return (
    <Box sx={{ padding: 2, maxWidth: 1200, mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography level="h1" sx={{ mb: 2 }}>
          Homepage
        </Typography>

        {/* Alert Demo */}
        <Alert color="primary" sx={{ mb: 3 }}>
          <Typography level="title-md">Welcome!</Typography>
          <Typography level="body-md">
            This page demonstrates various Joy UI components with theme support.
          </Typography>
        </Alert>
        <Alert color="danger" variant="outlined">
          <Typography color="danger" level="title-md">
            Attention!
          </Typography>
          <Typography color="danger" level="body-md">
            These aren't shared components. These components on this page are
            only for demonstration purposes.
          </Typography>
        </Alert>
        <Alert color="warning" variant="soft" sx={{ mt: 3 }}>
          <Typography color="warning" level="title-md">
            Note
          </Typography>
          <Typography color="warning" level="body-md">
            Make sure to use i18n in you real project. For Sample check{' '}
            <Link href="/weather">Weather</Link> page.
          </Typography>
        </Alert>
      </Box>

      {/* Typography Showcase */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h2" sx={{ mb: 3 }}>
            Typography Levels
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography level="h1">H1 Überschrift</Typography>
            <Typography level="h2">H2 Überschrift</Typography>
            <Typography level="h3">H3 Überschrift</Typography>
            <Typography level="h4">H4 Überschrift</Typography>
            <Typography level="title-lg">Title Large</Typography>
            <Typography level="title-md">Title Medium</Typography>
            <Typography level="title-sm">Title Small</Typography>
            <Typography level="body-lg">Body Large</Typography>
            <Typography level="body-md">Body Medium</Typography>
            <Typography level="body-sm">Body Small</Typography>
            <Typography level="body-xs">Body Extra Small</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3" sx={{ mb: 3 }}>
            Form Components
          </Typography>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Stack spacing={2}>
                <Input placeholder="Input field" />
                <Textarea placeholder="Textarea field" minRows={3} />
                <Select placeholder="Select option">
                  <Option value="option1">Option 1</Option>
                  <Option value="option2">Option 2</Option>
                  <Option value="option3">Option 3</Option>
                </Select>
              </Stack>
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography level="body-md" sx={{ mb: 1 }}>
                    Checkbox
                  </Typography>
                  <Checkbox
                    checked={checkboxChecked}
                    onChange={(e) => setCheckboxChecked(e.target.checked)}
                    label="Check me"
                  />
                </Box>
                <Box>
                  <Typography level="body-md" sx={{ mb: 1 }}>
                    Radio Group
                  </Typography>
                  <RadioGroup
                    value={radioValue}
                    onChange={(e) => setRadioValue(e.target.value)}
                  >
                    <Radio value="option1" label="Option 1" />
                    <Radio value="option2" label="Option 2" />
                  </RadioGroup>
                </Box>
                <Box>
                  <Typography level="body-md" sx={{ mb: 1 }}>
                    Switch
                  </Typography>
                  <Switch
                    checked={switchChecked}
                    onChange={(e) => setSwitchChecked(e.target.checked)}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Progress & Feedback */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3" sx={{ mb: 3 }}>
            Progress & Feedback
          </Typography>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Stack spacing={2}>
                <Box>
                  <Typography level="body-md" sx={{ mb: 1 }}>
                    Linear Progress
                  </Typography>
                  <LinearProgress determinate value={sliderValue} />
                </Box>
                <Box>
                  <Typography level="body-md" sx={{ mb: 1 }}>
                    Slider (Controls Progress)
                  </Typography>
                  <Slider
                    value={sliderValue}
                    onChange={(_, value) => setSliderValue(value)}
                    min={0}
                    max={100}
                  />
                </Box>
              </Stack>
            </Grid>
            <Grid xs={12} md={6}>
              <Stack spacing={2} alignItems="flex-start">
                <Box>
                  <Typography level="body-md" sx={{ mb: 1 }}>
                    Circular Progress
                  </Typography>
                  <CircularProgress determinate value={sliderValue} />
                </Box>
                <Box>
                  <Typography level="body-md" sx={{ mb: 1 }}>
                    Indeterminate Progress
                  </Typography>
                  <CircularProgress />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Chips & Badges */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3" sx={{ mb: 3 }}>
            Chips & Badges
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography level="body-md" sx={{ mb: 1 }}>
                Chips
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip color="primary">Primary</Chip>
                <Chip color="success">Success</Chip>
                <Chip color="warning">Warning</Chip>
                <Chip color="danger">Danger</Chip>
                <Chip color="neutral" variant="soft">
                  Neutral
                </Chip>
                <Chip color="primary" variant="outlined">
                  Outlined
                </Chip>
              </Stack>
            </Box>
            <Box>
              <Typography level="body-md" sx={{ mb: 1 }}>
                Badges
              </Typography>
              <Stack direction="row" spacing={2}>
                <Badge badgeContent={4} color="primary">
                  <Avatar>A</Avatar>
                </Badge>
                <Badge badgeContent={12} color="danger">
                  <Avatar>B</Avatar>
                </Badge>
                <Badge badgeContent="99+" color="success">
                  <Avatar>C</Avatar>
                </Badge>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Accordions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3" sx={{ mb: 3 }}>
            Accordions
          </Typography>
          <AccordionGroup>
            <Accordion>
              <AccordionSummary>
                <Typography level="title-md">Accordion 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography level="body-md">
                  This is the content of the first accordion. It demonstrates
                  how content can be collapsed and expanded.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary>
                <Typography level="title-md">Accordion 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography level="body-md">
                  This is the content of the second accordion with more detailed
                  information.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </AccordionGroup>
        </CardContent>
      </Card>

      {/* Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3" sx={{ mb: 3 }}>
            Table
          </Typography>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar size="sm">J</Avatar>
                    <Typography level="body-md">John Doe</Typography>
                  </Stack>
                </td>
                <td>
                  <Chip color="success" size="sm">
                    Active
                  </Chip>
                </td>
                <td>
                  <LinearProgress determinate value={85} sx={{ width: 100 }} />
                </td>
                <td>
                  <IconButton size="sm" color="primary">
                    ✏️
                  </IconButton>
                </td>
              </tr>
              <tr>
                <td>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar size="sm">A</Avatar>
                    <Typography level="body-md">Alice Smith</Typography>
                  </Stack>
                </td>
                <td>
                  <Chip color="warning" size="sm">
                    Pending
                  </Chip>
                </td>
                <td>
                  <LinearProgress determinate value={45} sx={{ width: 100 }} />
                </td>
                <td>
                  <IconButton size="sm" color="primary">
                    ✏️
                  </IconButton>
                </td>
              </tr>
            </tbody>
          </Table>
        </CardContent>
      </Card>

      {/* Lists */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3" sx={{ mb: 3 }}>
            Lists
          </Typography>
          <List>
            <ListItem>
              <ListItemDecorator>📋</ListItemDecorator>
              <Typography level="body-md">List item with icon</Typography>
            </ListItem>
            <ListItem>
              <ListItemDecorator>⭐</ListItemDecorator>
              <Typography level="body-md">Another list item</Typography>
            </ListItem>
            <ListItem>
              <ListItemDecorator>🎯</ListItemDecorator>
              <Typography level="body-md">Third list item</Typography>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Modal Demo */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3" sx={{ mb: 3 }}>
            Modal Demo
          </Typography>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        </CardContent>
      </Card>

      {/* Breadcrumbs */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h3" sx={{ mb: 3 }}>
            Breadcrumbs
          </Typography>
          <Breadcrumbs>
            <Link href="#">Home</Link>
            <Link href="#">Components</Link>
            <Typography>Demo</Typography>
          </Breadcrumbs>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h2" sx={{ mb: 2 }}>
            Modal Title
          </Typography>
          <Typography level="body-md" sx={{ mb: 3 }}>
            This is a modal dialog demonstrating the theme colors and
            typography. It includes various interactive elements.
          </Typography>
          <Stack spacing={2}>
            <Input placeholder="Input in modal" />
            <Button onClick={() => setModalOpen(false)}>Close Modal</Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default Home;
