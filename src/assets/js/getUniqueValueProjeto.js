import data from 'assets/jsons/projetos.json'

export function getUniqueValueProjeto(key) {
    const unique = new Set();
    data.forEach(item => {
        item[key].forEach(key => unique.add(key));
    });
    return Array.from(unique)
}