const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'c4zkzlpm',
  api_key: '752264689242465',   // Cloudinary Dashboard → Settings → API Key
  api_secret: 'GwC-szxjB_wN31k6gePatDKF2kM' // Dashboard → Settings → API Secret
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const body = JSON.parse(event.body);
    const { video, message } = body; // video is base64 data URL, message is text
    const folder = 'poochi_gift';

    // Upload video
    const videoResult = await cloudinary.uploader.upload(video, {
      resource_type: 'video',
      folder: folder,
      upload_preset: 'poochi_gift' // optional, but signed upload via SDK doesn't need preset
    });
    // Upload message as raw text file
    const messageResult = await cloudinary.uploader.upload(
      `data:text/plain;base64,${Buffer.from(message).toString('base64')}`,
      {
        resource_type: 'raw',
        folder: folder,
        public_id: `message-${Date.now()}`,
        format: 'txt'
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        videoUrl: videoResult.secure_url,
        messageUrl: messageResult.secure_url
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
