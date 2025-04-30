import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import { IncomingMessage } from 'http';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = {
  bodyParser: false, // Required for formidable to work
};

const parseForm = (req: IncomingMessage) => {
  const form = formidable({ multiples: false });
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { files } = await parseForm(event as unknown as IncomingMessage);
    const file = files.file as formidable.File;

    const fileBuffer = fs.readFileSync(file.filepath);
    const filePath = `uploads/${file.originalFilename}`;

    const { data, error } = await supabase.storage
      .from('music-files')
      .upload(filePath, fileBuffer, {
        contentType: file.mimetype || 'application/octet-stream',
        upsert: false,
      });

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ path: data?.path }),
    };
  } catch (err: any) {
    return { statusCode: 500, body: `Upload error: ${err.message}` };
  }
};
