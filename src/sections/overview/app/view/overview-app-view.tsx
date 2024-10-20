'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardContent } from 'src/layouts/dashboard';
import { AppWidgetSummaryEnhanced } from '../app-widget-summary-enhanced';

export function OverviewAppView() {
  const theme = useTheme();

  // State to store fetched data for chapter leaders
  const [totalChapterLeaders, setTotalChapterLeaders] = useState(0);
  const [chapterLeadersToday, setChapterLeadersToday] = useState(0);
  const [chapterLeadersYesterday, setChapterLeadersYesterday] = useState(0);
  const [chapterLeadersLast7Days, setChapterLeadersLast7Days] = useState(0);
  const [chapterLeadersLast30Days, setChapterLeadersLast30Days] = useState(0);

  // State to store fetched data for partners
  const [totalPartners, setTotalPartners] = useState(0);
  const [partnersToday, setPartnersToday] = useState(0);
  const [partnersYesterday, setPartnersYesterday] = useState(0);
  const [partnersLast7Days, setPartnersLast7Days] = useState(0);
  const [partnersLast30Days, setPartnersLast30Days] = useState(0);

  // State to store fetched data for restaurant testimonials
  const [totalRestaurantTestimonials, setTotalRestaurantTestimonials] = useState(0);
  const [testimonialsToday, setTestimonialsToday] = useState(0);
  const [testimonialsYesterday, setTestimonialsYesterday] = useState(0);
  const [testimonialsLast7Days, setTestimonialsLast7Days] = useState(0);
  const [testimonialsLast30Days, setTestimonialsLast30Days] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chapter leaders count
        const chapterLeadersResponse = await axios.get('/api/chapter-leader/count/');
        const {
          totalChapterLeaders: fetchedTotalChapterLeaders,
          addedToday: fetchedChapterLeadersToday,
          addedYesterday: fetchedChapterLeadersYesterday,
          addedLast7Days: fetchedChapterLeadersLast7Days,
          addedLast30Days: fetchedChapterLeadersLast30Days,
        } = chapterLeadersResponse.data;
        setTotalChapterLeaders(fetchedTotalChapterLeaders);
        setChapterLeadersToday(fetchedChapterLeadersToday);
        setChapterLeadersYesterday(fetchedChapterLeadersYesterday);
        setChapterLeadersLast7Days(fetchedChapterLeadersLast7Days);
        setChapterLeadersLast30Days(fetchedChapterLeadersLast30Days);

        // Fetch partners count
        const partnersResponse = await axios.get('/api/partner/count/');
        const {
          totalPartners: fetchedTotalPartners,
          addedToday: fetchedPartnersToday,
          addedYesterday: fetchedPartnersYesterday,
          addedLast7Days: fetchedPartnersLast7Days,
          addedLast30Days: fetchedPartnersLast30Days,
        } = partnersResponse.data;
        setTotalPartners(fetchedTotalPartners);
        setPartnersToday(fetchedPartnersToday);
        setPartnersYesterday(fetchedPartnersYesterday);
        setPartnersLast7Days(fetchedPartnersLast7Days);
        setPartnersLast30Days(fetchedPartnersLast30Days);

        // Fetch restaurant testimonials count
        const testimonialsResponse = await axios.get('/api/restaurant-testimonial/count/');
        const {
          totalRestaurantTestimonials: fetchedTotalRestaurantTestimonials,
          addedToday: fetchedTestimonialsToday,
          addedYesterday: fetchedTestimonialsYesterday,
          addedLast7Days: fetchedTestimonialsLast7Days,
          addedLast30Days: fetchedTestimonialsLast30Days,
        } = testimonialsResponse.data;
        setTotalRestaurantTestimonials(fetchedTotalRestaurantTestimonials);
        setTestimonialsToday(fetchedTestimonialsToday);
        setTestimonialsYesterday(fetchedTestimonialsYesterday);
        setTestimonialsLast7Days(fetchedTestimonialsLast7Days);
        setTestimonialsLast30Days(fetchedTestimonialsLast30Days);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop the loading indicator
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {/* Display loader while fetching data */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Grid xs={12} md={3}>
              <AppWidgetSummaryEnhanced
                title="Restaurant Testimonials"
                total={totalRestaurantTestimonials}
                addedToday={testimonialsToday}
                addedYesterday={testimonialsYesterday}
                addedLast7Days={testimonialsLast7Days}
                addedLast30Days={testimonialsLast30Days}
              />
            </Grid>

            <Grid xs={12} md={3}>
              <AppWidgetSummaryEnhanced
                title="Chapter Leaders"
                total={totalChapterLeaders}
                addedToday={chapterLeadersToday}
                addedYesterday={chapterLeadersYesterday}
                addedLast7Days={chapterLeadersLast7Days}
                addedLast30Days={chapterLeadersLast30Days}
              />
            </Grid>

            <Grid xs={12} md={3}>
              <AppWidgetSummaryEnhanced
                title="Partners"
                total={totalPartners}
                addedToday={partnersToday}
                addedYesterday={partnersYesterday}
                addedLast7Days={partnersLast7Days}
                addedLast30Days={partnersLast30Days}
              />
            </Grid>
          </>
        )}
      </Grid>
    </DashboardContent>
  );
}
