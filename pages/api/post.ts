import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../utils/client';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const query = `*[_type == "post"] | order(_createdAt desc){
            _id,
             caption,
               video{
                asset->{
                  _id,
                  url
                }
              },
              slug{
                current
              },
              userId,
              postedBy->{
                _id,
                username,
                image
              },
            likes,
            comments[]{
              comment,
              _key,
              postedBy->{
              _id,
              username,
              image
            },
            }
          }`;

    const data = await client.fetch(query);
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const document = req.body;

    client.create(document).then(() => res.status(201).json('Video Created'));
  } else if (req.method === 'PUT') {
  }
};

export default handler;
