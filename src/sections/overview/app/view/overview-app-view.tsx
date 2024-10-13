'use client';

import { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardContent } from 'src/layouts/dashboard';
import { AppWidgetSummary } from '../app-widget-summary';

export function OverviewAppView() {
  const theme = useTheme();

  // State to store fetched data
  const [totalChapterLeaders, setTotalChapterLeaders] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data using Axios in useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/count-chapter-leaders');
        // Assuming the response contains the total count in data.total
        console.log(response.data);
        setTotalChapterLeaders(response.data.chapterLeaderCount);
      } catch (error) {
        console.error('Error fetching total chapter leaders:', error);
      } finally {
        setLoading(false); // Stop the loading indicator
      }
    };

    fetchData(); // Call the function to fetch data
  }, []); // Empty dependency array means this will run once on component mount

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {/* Display loader while fetching data */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Grid xs={12} md={4}>
            <AppWidgetSummary
              title="Total Chapter Leaders"
              total={totalChapterLeaders} // Display the fetched data
            />
          </Grid>
        )}
      </Grid>
    </DashboardContent>
  );
}
