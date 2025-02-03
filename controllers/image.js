// const Clarifai = require('clarifai');
// const Model = require('clarifai-nodejs');

// const app = new Clarifai.App({
//   apiKey: '5372eeb8692f4e59954de38f12f3dc34',
// });

import pkg from 'clarifai-nodejs';
const { Model } = pkg;

const handleApiCall = async (req, res) => {
  const modelUrl = 'https://clarifai.com/clarifai/main/models/face-detection';
  const detectorModel = new Model({
    url: modelUrl,
    authConfig: {
      pat: '94a354e1fdc045bb83cd5e993db709a8',
    },
  });
  try {
    const detectorModelPrediction = await detectorModel.predictByUrl({
      url: req.body.input,
      inputType: 'image',
    });

    console.log('detectorModelPrediction', detectorModelPrediction);
    // Since we have one input, one output will exist here
    res.json(detectorModelPrediction);
  } catch (err) {
    res.status(400).json('unable to work with API');
  }
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json('unable to get entries'));
};

/* module.exports = {
  handleImage,
  handleApiCall,
}; */
export { handleImage, handleApiCall };
