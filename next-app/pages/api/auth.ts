import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.url) {
    const outletType:string = String(req.query.outlet);
    if (outletType === null) {
      res.status(400);
      res.end();
    }
    else {
      fetch('http://10.20.27.100/api/outlets/' + outletType + '/coap/auth', {
        method: 'POST',
        body: req.body
        })
      .catch(error => console.error('Error fetching data:', error));
    }

    res.status(200).end();
  }
}