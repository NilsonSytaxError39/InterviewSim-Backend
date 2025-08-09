import OpenAI from 'openai';

async function IARecomendacionesCalificacionesProgramacion({ pregunta, respuestaUser, respuestaEsperada }) {
    if (!pregunta || !respuestaUser || !respuestaEsperada) {
        throw new Error('Faltan parámetros requeridos para evaluar la respuesta del usuario.');
    }

    const message = [
        {
            role: "system",
            content: `Eres InterviewSim, un programa que evalúa respuestas de programación en entrevistas.
                      Compara la respuesta del usuario con la respuesta esperada.
                      Si la respuesta está completa y correcta, felicítalo y dale una calificación de 5.
                      Si tiene errores, proporciona recomendaciones detalladas y una calificación de 1 a 5.
                      Devuelve solo la calificación y la recomendación en el siguiente formato JSON:
                      {
                          "calificacion": <calificacion>,
                          "recomendacion": <recomendación>
                      }`
        },
        {
            role: "user",
            content: `Pregunta: ${pregunta}
                      Respuesta del Usuario: ${respuestaUser}
                      Respuesta Esperada: ${respuestaEsperada}`
        }
    ];

    const openai = new OpenAI({ apiKey: process.env.TOKEN_OPENAI });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: message,
            max_tokens: 2000, 
        });

        const responseContent = completion.choices[0].message.content.trim();
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseContent);
            if (typeof parsedResponse.calificacion === 'undefined' && typeof parsedResponse.recomendacion === 'undefined') {
                throw new Error('La respuesta de la IA no contiene la calificación o recomendación esperada.');
            }
        } catch (jsonError) {
            throw new Error(`La respuesta de la IA no está en el formato JSON esperado: ${jsonError.message}`);
        }

        // Aquí estaba el error de sintaxis, ahora corregido:
        console.log(parsedResponse.calificacion);
        console.log(parsedResponse.recomendacion);
        
        return parsedResponse; // Retorna la calificación y recomendación
    } catch (error) {
        console.error("Error al generar las recomendaciones:", error);
        return { error: "Hubo un error al generar las recomendaciones." };
    }
}

export default IARecomendacionesCalificacionesProgramacion;
