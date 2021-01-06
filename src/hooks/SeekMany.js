/**
 * Função helper específica para criação de etiquetas, que gera token Wegas e monta URL a partir de variável de ambiente e parâmetros 'url' e 'arr'.
 * O parâmetro 'arr' é iterado e cada item na lista gera uma requisição.
 * @param   {string}   url - Caminho a ser apendado ao construtor do fetch.
 * @param   {string[]} arr - Lista cuja iteração é apendada à URL do fetch.
 * @returns {object[]}     - JSON retorno da requisição.
 */
const SeekMany = async (url, arr) => {
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

  let all = await Promise.all(arr.map(i =>
    fetch(`${process.env.REACT_APP_LABEL_API}${url}${i}`, { headers: { "Authorization": `Bearer ${access_token}` } }).then(res => res.json())
  ));
  return all;
}

export default SeekMany;