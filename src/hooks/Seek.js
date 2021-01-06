/**
 * Função helper para requisições async que gera token Wegas e monta URL a partir de variável de ambiente e parâmetro 'url'.
 * @param   {string}   url - Caminho a ser apendado ao construtor do fetch.
 * @returns {object[]}     - JSON retorno da requisição.
 */
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
  let { access_token } = await fetch(process.env.REACT_APP_WEGAS_ENDPOINT, tokenOptions).then(res => res.json());

  let response = await fetch(`${process.env.REACT_APP_LABEL_API}${url}`, { headers: { "Authorization": `Bearer ${access_token}` } }).then(res => res.json());
  return response;
}

export default Seek;