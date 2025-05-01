
const Citation = require('../models/Citation');
const localListingSites = require('../config/localListingSites.json');

const syncModules = {
  google: async (citation) => {
    // TODO: Implement Google Business Profile API integration here
    return { success: true, citationId: 'google-actual-id' };
  },
  facebook: async (citation) => {
    // TODO: Implement Facebook API integration here
    return { success: true, citationId: 'facebook-actual-id' };
  },
  foursquare: async (citation) => {
    // TODO: Implement Foursquare API integration here
    return { success: true, citationId: 'foursquare-actual-id' };
  },
  // Add more site sync modules here
};

exports.syncCitation = async (req, res) => {
  const citationId = req.params.id;
  try {
    const result = await exports.syncCitationById(citationId, req.user.id);
    res.json({ message: 'Sync completed', syncData: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.syncCitationById = async (citationId, userId) => {
  const citation = await Citation.findOne({ _id: citationId, createdBy: userId });
  if (!citation) {
    throw new Error('Citation not found');
  }

  for (const site of localListingSites) {
    const syncFunc = syncModules[site.key];
    if (syncFunc) {
      try {
        const result = await syncFunc(citation);
        if (result.success) {
          citation.syncData.set(site.key, {
            citationId: result.citationId,
            status: 'success',
            lastSynced: new Date(),
            errorMessage: '',
          });
        } else {
          citation.syncData.set(site.key, {
            citationId: '',
            status: 'failed',
            lastSynced: new Date(),
            errorMessage: result.error || 'Unknown error',
          });
        }
      } catch (error) {
        citation.syncData.set(site.key, {
          citationId: '',
          status: 'failed',
          lastSynced: new Date(),
          errorMessage: error.message,
        });
      }
    } else {
      // No sync function implemented for this site
      citation.syncData.set(site.key, {
        citationId: '',
        status: 'failed',
        lastSynced: new Date(),
        errorMessage: 'Sync function not implemented',
      });
    }
  }

  await citation.save();

  return citation.syncData;
};
