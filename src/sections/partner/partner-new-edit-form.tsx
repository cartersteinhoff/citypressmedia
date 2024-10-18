'use client';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';
import { Field, Form } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

// Form schema validation using Zod
export const NewPartnerSchema = zod.object({
  id: zod.string().optional(),
  first_name: zod.string().min(1, { message: 'First Name is required!' }),
  last_name: zod.string().optional(),
  email: zod
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email is required!' }),
  phone: zod.string().regex(/^\+?\d{10,15}$/, { message: 'Invalid phone number' }),
  number_of_units: zod.number().min(2, { message: 'You must select at least 2 units.' }).max(20),
  bonus_units: zod.number().min(0).max(5),
  address1: zod.string().optional(),
  address2: zod.string().optional(),
  city: zod.string().optional(),
  state: zod.string().length(2, { message: 'State must be 2 characters' }).optional(),
  zip: zod
    .string()
    .regex(/^\d{5}(-\d{4})?$/, { message: 'Invalid zip code' })
    .optional(),
  referred_by_first_name: zod.string().optional(),
  referred_by_last_name: zod.string().optional(),
  isVerified: zod.boolean().optional(),
});

export type NewPartnerSchemaType = zod.infer<typeof NewPartnerSchema>;

type Props = {
  currentUser?: NewPartnerSchemaType;
  edit?: boolean;
};

export function PartnerNewEditForm({ currentUser, edit = false }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      number_of_units: currentUser?.number_of_units ?? null, // No default value for number_of_units
      bonus_units: currentUser?.bonus_units ?? 0, // Default to 0 for bonus_units
      address1: currentUser?.address1 || '',
      address2: currentUser?.address2 || '',
      city: currentUser?.city || '',
      state: currentUser?.state || '',
      zip: currentUser?.zip || '',
      referred_by_first_name: currentUser?.referred_by_first_name || '',
      referred_by_last_name: currentUser?.referred_by_last_name || '',
      isVerified: currentUser?.isVerified || false,
    }),
    [currentUser]
  );

  const methods = useForm<NewPartnerSchemaType>({
    mode: 'onChange', // Real-time validation
    resolver: zodResolver(NewPartnerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const endpoint = edit ? `/api/partner/?id=${currentUser?.id}` : '/api/partner';
      const method = edit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        toast.success(edit ? 'Partner updated successfully!' : 'Partner created successfully!');
        router.push('/dashboard/partners'); // Redirect after success
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'An error occurred');
      }
    } catch (error) {
      toast.error(edit ? 'Failed to update partner' : 'Failed to create partner');
    }
  });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Form methods={methods} onSubmit={onSubmit} style={{ width: '100%', maxWidth: '800px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                <Field.Text name="first_name" label="First Name" />
                <Field.Text name="last_name" label="Last Name" />
                <Field.Text name="email" label="Email" />
                <Field.Text name="phone" label="Phone" />

                {/* Number of Units Dropdown */}
                <FormControl fullWidth error={!!errors.number_of_units}>
                  <InputLabel>Number of Units</InputLabel>
                  <Controller
                    name="number_of_units"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} displayEmpty>
                        <MenuItem value="" disabled>
                          Select number of units
                        </MenuItem>
                        {Array.from({ length: 19 }, (_, i) => i + 2).map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.number_of_units && (
                    <Typography variant="body2" color="error">
                      {errors.number_of_units.message}
                    </Typography>
                  )}
                </FormControl>

                {/* Bonus Units Dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Bonus Units</InputLabel>
                  <Controller
                    name="bonus_units"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        {Array.from({ length: 6 }, (_, i) => i).map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>

                <Field.Text name="city" label="City" />
                <Field.Text name="state" label="State" />
                <Field.Text name="address1" label="Address Line 1" />
                <Field.Text name="address2" label="Address Line 2 (Optional)" />
                <Field.Text name="zip" label="Zip Code" />
                <Field.Text name="referred_by_first_name" label="Referred By (First Name)" />
                <Field.Text name="referred_by_last_name" label="Referred By (Last Name)" />

                {/* Email Verified Switch */}
                {/* <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="isVerified"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value || false}
                          onChange={(event) => field.onChange(event.target.checked)}
                        />
                      )}
                    />
                  }
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
                /> */}
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {edit ? 'Update Partner' : 'Create Partner'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </Box>
  );
}
