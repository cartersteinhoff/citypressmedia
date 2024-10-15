'use client';

// import type { IUserItem, IUserTableFilters } from 'src/types/user';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { PartnerTableRow } from '../partner-table-row';
import { PartnerTableToolbar } from '../partner-table-toolbar';
import { PartnerTableFiltersResult } from '../partner-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'display_name', label: 'Display Name', minWidth: 150, maxWidth: 300 },
  { id: '', width: 88 },
];

const columns = [{ value: 'first_name', label: 'First Name' }];

// ----------------------------------------------------------------------
type DashboardType = keyof typeof paths.dashboard;
interface DashboardTypeProps {
  type?: DashboardType;
}

export function PartnerListView({ type }: DashboardTypeProps) {
  const [leaders, setLeaders] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch('/api/partner');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setLeaders(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    }

    fetchLeaders();
  }, []);

  useEffect(() => {
    if (leaders.length > 0) {
      setTableData(leaders); // Ensure tableData is updated after leaders are fetched
    }
  }, [leaders]);

  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();
  const filters = useSetState({
    name: '',
    selectedColumn: 'first_name', // Default column to filter by
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset = !!filters.state.name;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/partner/?id=${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error('Failed to delete partner');
        }

        const deleteRow = tableData.filter((row) => row.id !== id);
        toast.success('Delete success!');
        setTableData(deleteRow);
        table.onUpdatePageDeleteRow(dataInPage.length);
      } catch (error) {
        toast.error('Failed to delete');
        console.error('Error deleting partner:', error);
      }
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const res = await Promise.all(
        table.selected.map((id) =>
          fetch(`/api/partner/delete?id=${id}`, {
            method: 'DELETE',
          })
        )
      );

      if (res.some((r) => !r.ok)) {
        throw new Error('Failed to delete some partners');
      }

      const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

      toast.success('Delete success!');
      setTableData(deleteRows);
      table.onUpdatePageDeleteRows({
        totalRowsInPage: dataInPage.length,
        totalRowsFiltered: dataFiltered.length,
      });
    } catch (error) {
      toast.error('Failed to delete selected');
      console.error('Error deleting selected partners:', error);
    }
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      const selectedPath = paths.dashboard[type];
      if (
        typeof selectedPath === 'object' &&
        'edit' in selectedPath &&
        typeof selectedPath.edit === 'function'
      ) {
        router.push(selectedPath.edit(id));
      }
    },
    [router, type] // Add 'type' to the dependency array
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'CPM Partner', href: (paths.dashboard as any)[type]?.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={(paths.dashboard as any)[type]?.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Partner
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'pending' && 'warning') ||
                      (tab.value === 'banned' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

          <PartnerTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            columns={columns}
            // Removed roles from the options prop
          />

          {canReset && (
            <PartnerTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PartnerTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure you want to delete <strong>{table.selected.length}</strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

// type ApplyFilterProps = {
//   inputData: IUserItem[];
//   filters: IUserTableFilters;
//   comparator: (a: any, b: any) => number;
// };

function applyFilter({ inputData, comparator, filters }: any) {
  const { name, selectedColumn, status } = filters;

  let filteredData = inputData;

  // Apply filtering dynamically based on the selected column
  if (name && selectedColumn) {
    filteredData = filteredData.filter((user) => {
      const fieldValue = user[selectedColumn]?.toString().toLowerCase();
      return fieldValue?.includes(name.toLowerCase());
    });
  }

  // Apply sorting
  const stabilizedThis = filteredData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
