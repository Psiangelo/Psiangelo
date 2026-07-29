/**
 * clinicPhoto — variantes leves da foto da landing clínica.
 *
 * O arquivo cadastrado é um PNG de 2 MB, ótimo como original e péssimo para
 * servir direto: no hero ele fica acima da dobra, e nas faixas "quem escreve" e
 * "quem organiza" ele aparece como um círculo de no máximo 176px. Aqui ficam os
 * recortes já prontos, um por uso.
 *
 * Se o admin trocou a foto, o caminho dele é devolvido intacto: o atalho só
 * vale para a imagem padrão, que é a única de que temos variantes geradas.
 */

const DEFAULT_SRC = '/images/angelo-terapia.png';

const VARIANTS = {
  // Retrato do hero: 760px em qualquer tela. Houve um corte de 420px só pra
  // celular, mas 72 KB não é o que pesa numa página com vídeo, e em tela densa
  // aquele corte aparecia macio.
  hero: {
    src: '/images/angelo-terapia-hero.jpg',
    srcMobile: null,
  },
  // Círculo das faixas de autor: nunca passa de 176px na tela, então 360px de
  // largura já cobre telas 2x. Aqui a economia é real: eram 2 MB.
  avatar: {
    src: '/images/angelo-terapia-avatar.jpg',
    srcMobile: null,
  },
};

/**
 * @param {string} src caminho vindo do admin
 * @param {'hero'|'avatar'} use
 * @returns {{ src: string, srcMobile: string|null }}
 */
export function clinicPhoto(src, use) {
  if (src !== DEFAULT_SRC) return { src, srcMobile: null };
  const v = VARIANTS[use];
  if (!v) return { src, srcMobile: null };
  return { src: v.src, srcMobile: v.srcMobile };
}
