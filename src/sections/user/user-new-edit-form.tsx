'use client'; // Ensure this is a client-side component

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form'; // Import the Form and Field components

// ----------------------------------------------------------------------

// Schema validation for the form using Zod
export const NewUserSchema = zod.object({
  id: zod.string().optional(), // ID field is optional
  status: zod.string().optional(),
  firstName: zod.string().min(1, { message: 'First Name is required!' }),
  lastName: zod.string().min(1, { message: 'Last Name is required!' }),
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phone: zod.string().min(1, { message: 'Phone number is required!' }),
  city: zod.string().min(1, { message: 'City is required!' }),
  reservedCity: zod.string().min(1, { message: 'Reserved City is required!' }), // Reserved City field
  state: zod.string().min(1, { message: 'State is required!' }),
  address1: zod.string().min(1, { message: 'Address is required!' }),
  address2: zod.string().optional(), // Optional field
  zip: zod.string().min(1, { message: 'Zip code is required!' }),
  referredByFirstName: zod.string().optional(), // Optional field
  referredByLastName: zod.string().optional(), // Optional field
});

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

// ----------------------------------------------------------------------

type Props = {
  currentUser?: NewUserSchemaType;
  edit?: boolean;
};

export function UserNewEditForm({ currentUser, edit = false }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      city: currentUser?.city || '',
      reservedCity: currentUser?.reservedCity || '', // Include reservedCity in default values
      state: currentUser?.state || '',
      address1: currentUser?.address1 || '',
      address2: currentUser?.address2 || '',
      zip: currentUser?.zip || '',
      referredByFirstName: currentUser?.referredByFirstName || '',
      referredByLastName: currentUser?.referredByLastName || '',
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

  const onSubmit = handleSubmit(async (data) => {
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
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
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

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="firstName" label="First Name" />
              <Field.Text name="lastName" label="Last Name" />
              <Field.Text name="email" label="Email" />
              <Field.Text name="phone" label="Phone" />
              <Field.Text name="city" label="City" />
              <Field.Text name="reservedCity" label="Reserved City" /> {/* Reserved City Field */}
              <Field.Text name="state" label="State" />
              <Field.Text name="address1" label="Address Line 1" />
              <Field.Text name="address2" label="Address Line 2 (Optional)" />
              <Field.Text name="zip" label="Zip Code" />
              <Field.Text name="referredByFirstName" label="Referred By (First Name)" />
              <Field.Text name="referredByLastName" label="Referred By (Last Name)" />
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
  );
}
