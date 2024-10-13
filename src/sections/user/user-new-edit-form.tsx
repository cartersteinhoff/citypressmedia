'use client';

import { z as zod } from 'zod';
import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid'; // Changed to use stable Grid
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// List of valid title options
const titleOptions = [
  { label: 'Chapter Leader', value: 'chapter_leader' },
  { label: 'State Director', value: 'state_director' },
  { label: 'Regional Director', value: 'regional_director' },
];

// Form schema validation using Zod
export const NewUserSchema = zod.object({
  id: zod.string().optional(), // ID field is optional
  status: zod.string().optional(),
  first_name: zod.string().min(1, { message: 'First Name is required!' }),
  last_name: zod.string().min(1, { message: 'Last Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phone: zod.string().min(1, { message: 'Phone number is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  state: zod.string().min(1, { message: 'State is required!' }),
  address1: zod.string().min(1, { message: 'Address is required!' }),
  address2: zod.string().optional(), // Optional field
  zip: zod.string().min(1, { message: 'Zip code is required!' }),
  reserved_cities: zod
    .array(zod.string())
    .min(1, { message: 'At least one Reserved City is required!' }), // Updated to array validation
  reserved_states: zod
    .array(zod.string())
    .min(1, { message: 'At least one Reserved State is required!' }), // Updated to array validation
  title: zod
    .array(zod.enum(['chapter_leader', 'state_director', 'regional_director']))
    .min(1, { message: 'At least one title is required!' }), // Now a multi-select array
  referred_by_first_name: zod.string().optional(), // Optional field
  referred_by_last_name: zod.string().optional(), // Optional field
});

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

type Props = {
  currentUser?: NewUserSchemaType;
  edit?: boolean;
};

export function UserNewEditForm({ currentUser, edit = false }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      city: currentUser?.city || '',
      reserved_cities: currentUser?.reserved_cities || [], // Now an array
      reserved_states: currentUser?.reserved_states || [], // Now an array
      state: currentUser?.state || '',
      address1: currentUser?.address1 || '',
      address2: currentUser?.address2 || '',
      zip: currentUser?.zip || '',
      title: currentUser?.title || [], // Multi-select for title
      referred_by_first_name: currentUser?.referred_by_first_name || '',
      referred_by_last_name: currentUser?.referred_by_last_name || '',
    }),
    [currentUser]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [newCity, setNewCity] = useState(''); // State for custom city input
  const [newState, setNewState] = useState(''); // State for custom state input

  const onSubmit = handleSubmit(async (data) => {
    console.log(methods.formState.errors);
    console.log(data);
    try {
      const endpoint = edit
        ? `/api/update-chapter-leader/${currentUser?.id}`
        : '/api/create-chapter-leader';
      const method = edit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Send the form data to the API
      });

      if (response.ok) {
        reset();
        toast.success(
          edit ? 'Chapter leader updated successfully!' : 'Chapter leader created successfully!'
        );
        router.push(paths.dashboard.chapterLeader.list); // Redirect after success
      } else {
        const errorData = await response.json();
        console.log(errorData);
        toast.error(errorData.message || 'An error occurred');
      }
    } catch (error) {
      toast.error(edit ? 'Failed to update chapter leader' : 'Failed to create chapter leader');
      console.error(error);
    }
  });

  return (
    <Box
      sx={{
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        // minHeight: '100vh', // Ensure it takes full height
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ pt: 3, pb: 5, px: 3 }}>
              {currentUser && (
                <Label
                  color={
                    (values.status === 'active' && 'success') ||
                    (values.status === 'banned' && 'error') ||
                    'warning'
                  }
                  sx={{ position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )}

              {currentUser && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value !== 'active'}
                          onChange={(event) =>
                            field.onChange(event.target.checked ? 'banned' : 'active')
                          }
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Banned
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Apply disable account
                      </Typography>
                    </>
                  }
                  sx={{
                    mx: 0,
                    mb: 3,
                    width: 1,
                    justifyContent: 'space-between',
                  }}
                />
              )}

              <Field.Switch
                name="isVerified"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />

              {currentUser && (
                <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                  <Button variant="soft" color="error">
                    Delete user
                  </Button>
                </Stack>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                <Field.Text name="first_name" label="First Name" />
                <Field.Text name="last_name" label="Last Name" />
                <Field.Text name="email" label="Email" />
                <Field.Text name="phone" label="Phone" />
                <Field.Text name="city" label="City" />
                <Field.Text name="state" label="State" />
                <Field.Text name="address1" label="Address Line 1" />
                <Field.Text name="address2" label="Address Line 2 (Optional)" />
                <Field.Text name="zip" label="Zip Code" />
                {/* Multi-Select Title Field */}
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Title</InputLabel>
                      <Select
                        {...field}
                        label="Title"
                        multiple
                        value={field.value || []}
                        onChange={(event) => field.onChange(event.target.value as string[])} // Fix applied here
                        renderValue={(selected) =>
                          titleOptions
                            .filter((option) => (selected as string[]).includes(option.value))
                            .map((option) => option.label)
                            .join(', ')
                        }
                      >
                        {titleOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Checkbox checked={(field.value as string[]).includes(option.value)} />{' '}
                            {/* Fix applied here */}
                            <ListItemText primary={option.label} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                <Field.Text name="referred_by_first_name" label="Referred By (First Name)" />
                <Field.Text name="referred_by_last_name" label="Referred By (Last Name)" />
              </Box>

              {/* Reserved Cities and Reserved States */}
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Controller
                      name="reserved_cities"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Reserved Cities</InputLabel>
                          <Select
                            {...field}
                            label="Reserved Cities"
                            multiple
                            value={field.value || []}
                            onChange={(event) => field.onChange(event.target.value)}
                            renderValue={(selected) => selected.join(', ')}
                          >
                            {field.value.map((city) => (
                              <MenuItem key={city} value={city}>
                                <Checkbox checked={field.value.includes(city)} />
                                <ListItemText primary={city} />
                              </MenuItem>
                            ))}
                          </Select>

                          {/* Add new city input */}
                          <Box display="flex" alignItems="center" mt={2}>
                            <TextField
                              label="Add New City"
                              value={newCity}
                              onChange={(e) => setNewCity(e.target.value)}
                              variant="outlined"
                              fullWidth
                            />
                            <IconButton
                              color="primary"
                              onClick={() => {
                                if (newCity && !field.value.includes(newCity)) {
                                  field.onChange([...field.value, newCity]);
                                  setNewCity(''); // Clear the input after adding
                                }
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Controller
                      name="reserved_states"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel>Reserved States</InputLabel>
                          <Select
                            {...field}
                            label="Reserved States"
                            multiple
                            value={field.value || []}
                            onChange={(event) => field.onChange(event.target.value)}
                            renderValue={(selected) => selected.join(', ')}
                          >
                            {field.value.map((state) => (
                              <MenuItem key={state} value={state}>
                                <Checkbox checked={field.value.includes(state)} />
                                <ListItemText primary={state} />
                              </MenuItem>
                            ))}
                          </Select>

                          {/* Add new state input */}
                          <Box display="flex" alignItems="center" mt={2}>
                            <TextField
                              label="Add New State"
                              value={newState}
                              onChange={(e) => setNewState(e.target.value)}
                              variant="outlined"
                              fullWidth
                            />
                            <IconButton
                              color="primary"
                              onClick={() => {
                                if (newState && !field.value.includes(newState)) {
                                  field.onChange([...field.value, newState]);
                                  setNewState(''); // Clear the input after adding
                                }
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {edit ? 'Update Chapter Leader' : 'Create Chapter Leader'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </Box>
  );
}
