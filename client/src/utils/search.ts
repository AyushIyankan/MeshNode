var axios = require("axios");

const search = async (searchTerm: string) => {
    const config = {
        method: "get",
        url: `https://api.pinata.cloud/data/pinList?status=pinned&pinStart=2023-06-08T17:30:00.000Z&metadata[name]=${searchTerm}&pageLimit=15`,
        headers: {
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0NDExYTc2YS01ZmI1LTQ3YzQtOTIzYS05ZGZkMzI1MTExZmEiLCJlbWFpbCI6InZpamF5a3VtYXJkZXZrdGdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjI4MTk1YmUwYTQyNDc0ZjNhZDkyIiwic2NvcGVkS2V5U2VjcmV0IjoiNTVjMjNkNzMwNzQ0OTJiMzgwNzJkMTg0OTBlNTc5OWE0YTUzNzAyMTI3MjZhZGQ5OGY4YThiZjNjMzgwMDhjNCIsImlhdCI6MTY4NTYzNzQ0N30.XRT4BGjNAYbPoZQkZaGztKBwE4DxKYUGNJiWcVM7jnU",
        },
    };

    const res = await axios(config);

    if (res.data.count > 0) {
        return res.data.rows;
    } else {
        return [];
    }
};

export default search;
