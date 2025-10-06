export async function obtenerAprendicesFicha(urlFicha) {
    try {
        console.log('Intentando obtener datos de:', urlFicha); // Debug
        const response = await fetch(urlFicha);
        if (!response.ok) throw new Error('Error en la petición: ' + response.status);
        const dataFicha = await response.json();
        console.log('Datos de la ficha recibidos:', dataFicha); // Debug
        
        // Asegurarnos de que tenemos la estructura correcta
        const resultado = {
            programa: dataFicha.programa || '',
            aprendices: Array.isArray(dataFicha.aprendices) ? dataFicha.aprendices : []
        };
        console.log('Datos procesados:', resultado); // Debug
        return resultado;
    } catch (error) {
        console.error('Error:', error);
        return {
            programa: '',
            aprendices: []
        };
    }
}

// Función para filtrar un aprendiz específico por documento
export function filtrarAprendizPorDocumento(aprendices, documento) {
    return aprendices.find(aprendiz => aprendiz.documento === documento);
}
