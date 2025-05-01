const cron = require('node-cron');
const Citation = require('./models/Citation');
const syncController = require('./controllers/syncController');

// Schedule sync job to run every day at 2am
cron.schedule('0 2 * * *', async () => {
  console.log('Running scheduled sync job for all citations...');
  try {
    const citations = await Citation.find({});
    for (const citation of citations) {
      try {
        await syncController.syncCitationById(citation._id, citation.createdBy);
        console.log(`Synced citation ${citation._id}`);
      } catch (err) {
        console.error(`Failed to sync citation ${citation._id}:`, err.message);
      }
    }
    console.log('Scheduled sync job completed.');
  } catch (err) {
    console.error('Error running scheduled sync job:', err.message);
  }
});
