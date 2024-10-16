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
import Grid from '@mui/material/Grid';
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
  number_of_units: zod.number().min(2).max(20).optional(),
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
  status: zod.string().optional(), // Add status to the schema
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
      number_of_units: currentUser?.number_of_units ?? 0,
      address1: currentUser?.address1 || '',
      address2: currentUser?.address2 || '',
      city: currentUser?.city || '',
      state: currentUser?.state || '',
      zip: currentUser?.zip || '',
      referred_by_first_name: currentUser?.referred_by_first_name || '',
      referred_by_last_name: currentUser?.referred_by_last_name || '',
    }),
    [currentUser]
  );

  const methods = useForm<NewPartnerSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewPartnerSchema),
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
        router.push(paths.dashboard.partner.list); // Redirect after success
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
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ pt: 3, pb: 5, px: 3 }}>
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
                <Field.Text name="number_of_units" label="Number of Units" type="number" />
                <Field.Text name="city" label="City" />
                <Field.Text name="state" label="State" />
                <Field.Text name="address1" label="Address Line 1" />
                <Field.Text name="address2" label="Address Line 2 (Optional)" />
                <Field.Text name="zip" label="Zip Code" />
                <Field.Text name="referred_by_first_name" label="Referred By (First Name)" />
                <Field.Text name="referred_by_last_name" label="Referred By (Last Name)" />
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
