import React from 'react';
import html2pdf from 'html2pdf.js';
import qrcode from '../assets/images/qr-code.png';
import icon from '../assets/images/icon.png';
import '../assets/styles/sticker.css';
import useFullPageLoader from '../hooks/useFullPageLoader';

/**
 * Componente que recebe lista de retornos e gera lista de etiquetas de segurança para renderização.
 * @param {object[]} props.mmv - Lista de retornos da API, gerada pela função SeekMany no componente 'App'.
 */
const Sticker = ({ mmv }) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader(); // Spinner de tela cheia, visível durante carregamentos.

  /**
   * Enumerador para disponibilidade de item de segurança. e.g:
   * typeEnums[2] === "Não disponível"
   */
  const typeEnums = ["", "Série", "Não disponível", "Não aplicável", "Opcional"];

  /**
   * Função geradora de PDF utilizando dependência 'html2pdf.js'.
   * O elemento HTML 'el' é transformado na seguinte ordem: html -> canvas -> imagem -> pdf
   * A constante 'opt' serve para configurar a função. A propriedade 'opt.pagebreak.after' recebe sintaxe CSS para determinar onde quebrar a página.
   * '.Sticker:nth-child(even):not(:last-child)' = Todo elemento de classe 'Sticker' par e que não é o último filho do elemento pai (evita última página vazia).
   */
  async function handlePdf() {
    showLoader();
    const opt = {
      filename: "etiquetas.pdf",
      margin: 16,
      pagebreak: { mode: ["avoid-all", "css", "legacy"], after: [".Sticker:nth-child(even):not(:last-child)"] },
      html2canvas: { scale: 3 },
      jsPDF: { orientation: "landscape" }
    };
    const el = document.querySelector(".Stickers");
    await html2pdf().set(opt).from(el).save();
    hideLoader();
  }

  return (
    <>
      {loader}
      <button className="handlePdf" onClick={handlePdf}>Baixar PDF</button>
      <div className="Stickers">
        {mmv.map((i, j) => (
          <div key={j} className="Sticker">
            <div className="outerBorder">
              <div className="innerBorder">
                <div className="stickerContent">
                  <div className="stickerHead">
                    <div>
                      <img src={icon} width="70%" alt="Ícone ENSV" />
                    </div>
                    <div className="stickerYear">
                      <h2>{i.Ano}</h2>
                    </div>
                    <div className="stickerItensA headItens">
                      <div><p>Tipo:</p><p>{i.Tipo}</p></div>
                      <div><p>Marca:</p><p>{i.MMV}</p></div>
                      <div><p>Modelo:</p><p>{i.Modelo}</p></div>
                      <div><p>Versão:</p><p>{i.Versao}</p></div>
                      <div><p>CAT n°:</p><p>{i.Cat}</p></div>
                    </div>
                  </div>
                  <div className="grupoA">
                    <div className="sectionTitle"><h5>ITENS:</h5></div>
                    <div className="stickerItensA">
                      {/* Itens de segurança de grupo A */}
                      {i.Items.filter(item => item.Grupo === "A").map((a, keyA) => (
                        <div key={keyA}><p>{a.Descricao}</p><p>{typeEnums[a.Disponibilidade]}</p></div>
                      ))}
                    </div>
                  </div>
                  <div className="grupoA grupoB">
                    <div className="sectionTitle"><h5>REQUISITOS INOVADORES:</h5><h5>&nbsp;</h5></div>
                    <div className="stickerItensA">
                      {/* Obrigatoriamente inclui os três itens especificados abaixo, independente de grupo ou disponibilidade */}
                      {i.Items.filter(item => item.Descricao.includesOneOf(["Impacto frontal", "Impacto lateral", "Proteção para pedestre"])).map((b, keyB) =>
                        i.Tipo === "Automóvel" && b.Descricao.includes("Impacto frontal") ?
                        (<div key={keyB}></div>) :
                        (<div key={keyB}><p>{b.Descricao}</p><p>{typeEnums[b.Disponibilidade]}</p></div>)
                      )}
                      {/* Inversão booleana para incluir todos os itens exceto os especificados abaixo, itens de segurança de grupos B e C */}
                      {i.Items.filter(item => !item.Descricao.includesOneOf(["Impacto frontal", "Impacto lateral", "Proteção para pedestre"])).filter(item => item.Grupo === "B" || item.Grupo === "C").filter(item => item.Disponibilidade === "1" || item.Disponibilidade === "4").map((b, keyB) => (
                          <div key={keyB}><p>{b.Descricao}</p><p>{typeEnums[b.Disponibilidade]}</p></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="stickerFooter">
                  <h6>O VEÍCULO ETIQUETADO ATENDE INTEGRALMENTE AOS REGULAMENTOS DE SEGURANÇA EXIGIDOS PELO CONTRAN.</h6>
                  <div className="credits">
                    <div className="qrCode">
                      <img src={qrcode} alt="Código QR" />
                    </div>
                    <div className="creditsText">
                      <p>DENATRAN</p>
                      <p>MINISTÉRIO DA<br /><b>INFRAESTRUTURA</b></p>
                      <p>GOVERNO<br />FEDERAL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="handlePdf" onClick={handlePdf}>Baixar PDF</button>
    </>
  )
}

export default Sticker;