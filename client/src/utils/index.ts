import axios from 'axios';

export const getPreviewImage = (file: File): string | undefined => {
  if (file) {
    try {
      return URL.createObjectURL(file);
    } catch (err) {
      if (err) return;
    }
  }
  return;
};

const PINATA_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
const IPFS_LINK = process.env.NEXT_PUBLIC_IPFS_LINK;

const pinFileToIPFS = async (file: File, description: string) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      name: file.name,
      description: description,
    },
  });

  data.append('pinataMetadata', metadata);

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': `multipart/form-data;`,
        pinata_api_key: PINATA_KEY,
        pinata_secret_api_key: PINATA_SECRET,
      },
    });

    return response;
  } catch (error) {
    console.log('Error', error);
  }
};

export const uploadFileToPinata = async (file: File | null) => {
  if (!file) return '';

  try {
    let result: any = await pinFileToIPFS(file, 'Express Demo');
    if (result.status === 200) {
      return `${IPFS_LINK}${result.data.IpfsHash}`;
    } else {
      return '';
    }
  } catch (err) {
    console.log(err);
    return '';
  }
};

const pinJSONToIPFS = async (JSONBody: any, metadata: any) => {
  const data = JSON.stringify({
    pinataMetadata: metadata,
    pinataContent: JSONBody,
  });

  var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0NDExYTc2YS01ZmI1LTQ3YzQtOTIzYS05ZGZkMzI1MTExZmEiLCJlbWFpbCI6InZpamF5a3VtYXJkZXZrdGdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImI2Njg5NWU3N2M2NmI2YWU1ZmVmIiwic2NvcGVkS2V5U2VjcmV0IjoiMTQzOTQyMmE4NDg5OWQ3NzIxZDI5MjgwMTgyZjQ2ZjViN2M0NjJhNzdhZDg2YWZiOWRjZGEyYWFhZmQ5NGYzYSIsImlhdCI6MTY4NTk4MDg2OH0.wdC0QN5ZYJEtfdIanc3fFOTJxqTfYZoATTU4U6aBLmM',
    },
    data: data,
  };

  try {
    const response = await axios(config);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const uploadJSONToPinata = async (json: any, metadata: any) => {
  try {
    let result: any = await pinJSONToIPFS(json, metadata);
    if (result.status === 200) {
      return `${IPFS_LINK}${result.data.IpfsHash}`;
    } else {
      return '';
    }
  } catch (err) {
    console.log(err);
    return '';
  }
};

export const fetchPinataURItoJSON = async (url: string) => {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response?.data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};
