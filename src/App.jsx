import React, { useState, useEffect } from "react";
import Picker from 'react-mobile-picker';
import useFullPageLoader from './hooks/useFullPageLoader';
import Seek from './hooks/Seek';
import SeekMany from './hooks/SeekMany';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import Banner from './components/Banner';
import Sticker from './components/Sticker';
import Download from './components/icons/Download';

/**
 * Componente principal, contém cabeçalho, listagem de modelos e Integrator D6 (para header e footer da marca VW).
 */
export default function App() {

  const [valid, setValid] = useState(false); // Chave que determina visibilidade da página.
  const [loader, showLoader, hideLoader] = useFullPageLoader(); // Spinner de tela cheia, visível durante carregamentos.

  const [valueGroups, setValueGroups] = useState({ year: 2021 }); // Model year selecionado.
  const optionGroups = { year: [2020, 2021, 2022, 2023] }; // Lista de anos (model year) disponíveis.

  const [models, setModels] = useState([]); // Lista de modelos para o model year selecionado.
  const modelEnums = [ // Enumerador de modelos, para nome e imagem apresentados.
    { displayName: "Amarok", name: "AMAROK", image: require("./assets/images/amarok.png").default },
    { displayName: "Fox", name: "FOX", image: require("./assets/images/fox.webp").default },
    { displayName: "Gol", name: "GOL", image: require("./assets/images/gol.webp").default },
    { displayName: "Golf", name: "GOLF", image: require("./assets/images/golf.png").default },
    { displayName: "Nivus", name: "NIVUS", image: require("./assets/images/nivus.webp").default },
    { displayName: "Jetta", name: "JETTA", image: require("./assets/images/novo-jetta.webp").default },
    { displayName: "Polo", name: "POLO", image: require("./assets/images/polo.webp").default },
    { displayName: "Nova Saveiro", name: "NOVA SAVEIRO", image: require("./assets/images/saveiro.webp").default },
    { displayName: "Saveiro", name: "SAVEIRO", image: require("./assets/images/saveiro.webp").default },
    { displayName: "T-Cross", name: "T CROSS", image: require("./assets/images/t-cross.webp").default },
    { displayName: "Tiguan", name: "TIGUAN", image: require("./assets/images/tiguan-allspace.webp").default },
    { displayName: "up!", name: "UP", image: require("./assets/images/up.webp").default },
    { displayName: "Virtus", name: "VIRTUS", image: require("./assets/images/virtus.webp").default },
    { displayName: "Voyage", name: "VOYAGE", image: require("./assets/images/voyage.webp").default },
  ]

  const MySwal = withReactContent(Swal); // Instância de SweetAlert2 para pop-up.

  useEffect(() => {
    async function getIntegrator() { // Função que busca Integrator VW e inclui na página.
      try {
        // Busca template do Integrator e JSON de configuração
        let endpoints = [
          "https://my-vw-bff-prod.apps.na.vwapps.io/api/v1/settings/integrator",
          "https://www.vw.com.br/pt/servicos-e-acessorios/selodigital.integrator-includes.json"
        ];
        let [resHTML, resJSON] = await Promise.all(endpoints.map(i => fetch(i).then(res => res.text())));
        resJSON = JSON.parse(resJSON);
    
        // Processa metadados e footer
        const doc = (new DOMParser()).parseFromString(resHTML, "text/html");
        document.head.innerHTML += doc.querySelector("head").innerHTML;
        document.querySelector("#vwa_d6_cms_integrator_ssr_container").innerHTML += doc.querySelector("#vwa_d6_cms_integrator_ssr_container").innerHTML;
    
        // Processa header
        window.vwa_d6_cms = {};
        window.vwa_d6_cms.integratorSpaModel = resJSON.model;
        let script = document.createElement("script");
        script.setAttribute("src", resJSON.scriptSources[0]);
        document.head.appendChild(script);

        setValid(true);
      } catch (err) {
        console.log(err)
      }
    }
    getIntegrator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function getModels() { // Função que busca modelos para o model year selecionado. Executada toda vez que o valor de 'valueGroups' muda.
      showLoader();
      await Seek(`/GetByYear?year=${valueGroups.year}`).then(res => setModels(typeof res === "object" && res.sort((i, j) => i.Modelo.localeCompare(j.Modelo))));
      hideLoader();
    }
    getModels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueGroups])

  function handleChange(name, value) { // Função que trata mudança do model year selecionado.
    setValueGroups({ [name]: value })
  }

  /**
   * Função que mostra spinner de tela cheia, chama SeekMany para retornar dados da API e abre modal/pop-up com etiquetas de segurança.
   * @param {HTMLAnchorElement} e        - Elemento HTML em foco, referenciado apenas para evitar comportamento padrão.
   * @param {string[]}          mmvCodes - Lista de códigos MMV para iteração e requisição dos dados da etiqueta de segurança em questão.
   */
  async function handleMMV(e, mmvCodes) {
    e.preventDefault();
    showLoader();
    window.scrollTo(0, 0); // Volta para o topo da página devido a incompatibilidades com gerador de PDF.
    await SeekMany("/GetItemsByMMV?codigoMMV=", mmvCodes).then(res => {
      MySwal.fire({ // Chama pop-up SweetAlert2 com etiquetas de segurança geradas a partir do retorno de SeekMany.
        html: <Sticker mmv={res} />,
        showCloseButton: true,
        showConfirmButton: false
      })
    })
    hideLoader();
  }

  return (
    <>
        <div className="App">
          <Banner />
          <div className="Content">
            <div className="Year">
              <p>Escolha o ano do seu modelo</p>
              <Picker // Seletor de model year
                optionGroups={optionGroups}
                valueGroups={valueGroups}
                onChange={handleChange}
                />
            </div>
            <p>Escolha o seu modelo para fazer <b>download da etiqueta</b></p>
            {valid ? (
            <div className="Vehicles">
              {typeof models === "object" ? models.map((model, key) => (
                <div key={key} className="Vehicle">
                  <img src={modelEnums.find(e => e.name === model.Modelo)?.image || require("./assets/images/coringa.png").default} alt={model.Modelo} />
                  <h2>{modelEnums.find(e => e.name === model.Modelo)?.displayName || model.Modelo}</h2>
                  <div className="Versions">
                    {model.Items.length >= 2 && (
                      <a href=" #" className="Download" onClick={(e) => handleMMV(e, model.Items.map(item => item.CodigoMMV))}>
                        <Download />
                        <p>Todas as versões</p>
                      </a>
                    )}
                    {model.Items.map((version, key2) => (
                      <a key={key2} href=" #" className="Download" onClick={(e) => handleMMV(e, [version.CodigoMMV])}>
                        <Download />
                        <p>{version.Versao}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )) : (<p style={{ textAlign: "center", width: "100%" }}>Nenhum modelo encontrado.</p>)}
            </div>
          ) : (<></>)}
          </div>
        </div>
      {loader}
    </>
  );
}
