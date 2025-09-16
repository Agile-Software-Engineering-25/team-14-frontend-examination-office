import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  Badge,
  Avatar,
  LinearProgress,
  CircularProgress,
  Input,
  Textarea,
  Select,
  Option,
  Checkbox,
  Radio,
  Switch,
  Slider,
  Link,
  Stack,
  Grid,
  Divider,
} from '@mui/joy';

const JoyColorShowcase = () => {
  // Joy UI's 5 default color palettes
  const colors = ['primary', 'neutral', 'danger', 'success', 'warning'];

  // Joy UI's 4 global variants
  const variants = ['solid', 'soft', 'outlined', 'plain'];

  const ComponentShowcase = ({ color }) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography level="h3" sx={{ mb: 2, textTransform: 'capitalize' }}>
          {color} Color Palette
        </Typography>

        {/* Buttons with all variants */}
        <Box sx={{ mb: 3 }}>
          <Typography level="body-md" sx={{ mb: 1 }}>
            Buttons:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {variants.map((variant) => (
              <Button key={variant} color={color} variant={variant}>
                {variant}
              </Button>
            ))}
            <Button color={color} loading>
              Loading
            </Button>
            <Button color={color} disabled>
              Disabled
            </Button>
          </Stack>
        </Box>

        {/* Chips */}
        <Box sx={{ mb: 3 }}>
          <Typography level="body-md" sx={{ mb: 1 }}>
            Chips:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {variants.map((variant) => (
              <Chip key={variant} color={color} variant={variant}>
                {variant}
              </Chip>
            ))}
          </Stack>
        </Box>

        {/* Icon Buttons */}
        <Box sx={{ mb: 3 }}>
          <Typography level="body-md" sx={{ mb: 1 }}>
            Icon Buttons:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {variants.map((variant) => (
              <IconButton key={variant} color={color} variant={variant}>
                ★
              </IconButton>
            ))}
          </Stack>
        </Box>

        {/* Alerts */}
        <Box sx={{ mb: 3 }}>
          <Typography level="body-md" sx={{ mb: 1 }}>
            Alerts:
          </Typography>
          <Stack spacing={1}>
            {variants.map((variant) => (
              <Alert key={variant} color={color} variant={variant}>
                This is a {variant} {color} alert
              </Alert>
            ))}
          </Stack>
        </Box>

        {/* Badges */}
        <Box sx={{ mb: 3 }}>
          <Typography level="body-md" sx={{ mb: 1 }}>
            Badges:
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {variants.map((variant) => (
              <Badge
                key={variant}
                badgeContent={4}
                color={color}
                variant={variant}
              >
                <Avatar size="sm">A</Avatar>
              </Badge>
            ))}
          </Stack>
        </Box>

        {/* Progress Indicators */}
        <Box sx={{ mb: 3 }}>
          <Typography level="body-md" sx={{ mb: 1 }}>
            Progress:
          </Typography>
          <Stack spacing={2}>
            <LinearProgress color={color} determinate value={60} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              {variants.map((variant) => (
                <CircularProgress
                  key={variant}
                  color={color}
                  variant={variant}
                  determinate
                  value={75}
                />
              ))}
            </Box>
          </Stack>
        </Box>

        {/* Form Elements */}
        <Box sx={{ mb: 3 }}>
          <Typography level="body-md" sx={{ mb: 1 }}>
            Form Elements:
          </Typography>
          <Stack spacing={2}>
            <Input color={color} placeholder={`${color} input`} />
            <Textarea
              color={color}
              placeholder={`${color} textarea`}
              minRows={2}
            />
            <Select color={color} placeholder={`${color} select`}>
              <Option value="1">Option 1</Option>
              <Option value="2">Option 2</Option>
            </Select>
            <Stack direction="row" spacing={2} alignItems="center">
              <Checkbox color={color} label={`${color} checkbox`} />
              <Radio color={color} label={`${color} radio`} />
              <Switch color={color} />
              <Slider color={color} defaultValue={30} sx={{ width: 100 }} />
            </Stack>
          </Stack>
        </Box>

        {/* Links */}
        <Box>
          <Typography level="body-md" sx={{ mb: 1 }}>
            Links:
          </Typography>
          <Stack direction="row" spacing={2}>
            {variants.map((variant) => (
              <Link key={variant} color={color} variant={variant} href="#">
                {variant} link
              </Link>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ padding: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography level="h1" sx={{ mb: 4, textAlign: 'center' }}>
        Joy UI Complete Color System
      </Typography>

      <Typography level="body-lg" sx={{ mb: 4, textAlign: 'center' }}>
        Joy UI includes 5 built-in semantic color palettes:{' '}
        <strong>primary</strong>, <strong>neutral</strong>,{' '}
        <strong>danger</strong>, <strong>success</strong>, and{' '}
        <strong>warning</strong>. Each color works with 4 global variants:{' '}
        <strong>solid</strong>, <strong>soft</strong>, <strong>outlined</strong>
        , and <strong>plain</strong>.
      </Typography>

      {/* Color Palette Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h2" sx={{ mb: 3 }}>
            Color Palette Overview
          </Typography>
          <Grid container spacing={2}>
            {colors.map((color) => (
              <Grid key={color} xs={12} sm={6} md={4} lg={2.4}>
                <Stack spacing={1}>
                  <Typography
                    level="title-md"
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {color}
                  </Typography>
                  {variants.map((variant) => (
                    <Button
                      key={variant}
                      color={color}
                      variant={variant}
                      size="sm"
                    >
                      {variant}
                    </Button>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Detailed showcase for each color */}
      {colors.map((color) => (
        <ComponentShowcase key={color} color={color} />
      ))}
    </Box>
  );
};

export default JoyColorShowcase;
