export async function obtenerFichas() {
  const URL = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/JUICIOS_ADSO.json";
  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error('Error en la petición: ' + response.status);
    const data = await response.json();
    return data.fichas; // retorno la lista de fichas
  } catch (error) {
    console.error('Error:', error);
    return [];//retono una array vacio
  }
}
