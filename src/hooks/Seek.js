const Seek = async (url) => {
  const tokenOptions = {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.REACT_APP_TOKEN_KEY,
      client_secret: process.env.REACT_APP_TOKEN_SECRET
    }).toString()
  }
  let { access_token } = await fetch("https://api.qs.volkswagen.com.br/token", tokenOptions).then(res => res.json());

  let response = await fetch(`${process.env.REACT_APP_LABEL_API}${url}`, { headers: { "Authorization": `Bearer ${access_token}` } }).then(res => res.json());
  return response;
}

export default Seek;