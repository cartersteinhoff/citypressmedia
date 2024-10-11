import type { IUserItem } from 'src/types/user';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  row: IUserItem;
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }: Props) {
  const confirm = useBoolean();
  const popover = usePopover();
  const quickEdit = useBoolean();

  // Use the fields from the IUserItem (Chapter Leader) model
  const {
    first_name,
    last_name,
    email,
    phone, // Assumed to be phone number
    reserved_cities,
    city,
    state,
    referred_by_first_name,
    referred_by_last_name,
  } = row;

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        {/* Display the full name (first and last) */}
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            {/* <Avatar alt={`${first_name} ${last_name}`} /> */}
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {`${first_name} ${last_name}`}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{email}</TableCell> */}

        {/* Display phone number */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{phone}</TableCell>

        {/* Display reserved city */}
        {/* <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '10px' }}>{reserved_cities}</TableCell> */}

        {/* Display city and state */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{city}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{state}</TableCell>

        {/* Display the referral details */}
        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {`${referred_by_first_name} ${referred_by_last_name}`}
        </TableCell> */}

        {/* Actions: Quick Edit and More Options */}
        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {/* Quick Edit Form */}
      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      {/* Popover for more actions (Delete/Edit) */}
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* Confirm Dialog for Deletion */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this item?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
