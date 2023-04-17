export default function PorcentagemConclusao() {
    const dataAtual = new Date();
    const outraData = new Date('2023-02-27');

    const diferencaEmMilissegundos = dataAtual - outraData;

    const diferencaEmDias = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));
    const porcentagem = (100 * diferencaEmDias) / 1461

    return Math.ceil(porcentagem)
}
