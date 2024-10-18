'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardContent } from 'src/layouts/dashboard';
import { AppWidgetSummary } from '../app-widget-summary';

export function OverviewAppView() {
  const theme = useTheme();

  // State to store fetched data
  const [totalChapterLeaders, setTotalChapterLeaders] = useState(0);
  const [totalPartners, setTotalPartners] = useState(0); // For partners count
  const [totalRestaurantTestimonials, setTotalRestaurantTestimonials] = useState(0); // For restaurant testimonials count
  const [loading, setLoading] = useState(true);

  // Fetch data using Axios in useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chapter leaders count
        const chapterLeadersResponse = await axios.get('/api/chapter-leader/count/');
        setTotalChapterLeaders(chapterLeadersResponse.data.chapterLeaderCount);

        // Fetch partners count
        const partnersResponse = await axios.get('/api/partner/count/');
        setTotalPartners(partnersResponse.data.partnerCount);

        // Fetch restaurant testimonials count
        const testimonialsResponse = await axios.get('/api/restaurant-testimonial/count/');
        setTotalRestaurantTestimonials(testimonialsResponse.data.restaurantTestimonialCount);
      } catch (error) {
        console.error('Error fetching data:', error);
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
          <>
            <Grid xs={12} md={4}>
              <AppWidgetSummary
                title="Total Chapter Leaders"
                total={totalChapterLeaders} // Display the fetched chapter leaders count
              />
            </Grid>

            <Grid xs={12} md={4}>
              <AppWidgetSummary
                title="Total Partners"
                total={totalPartners} // Display the fetched partners count
              />
            </Grid>

            <Grid xs={12} md={4}>
              <AppWidgetSummary
                title="Total Restaurant Testimonials"
                total={totalRestaurantTestimonials} // Display the fetched restaurant testimonials count
              />
            </Grid>
          </>
        )}
      </Grid>
    </DashboardContent>
  );
}
