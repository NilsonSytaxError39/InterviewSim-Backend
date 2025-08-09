import OpenAI from 'openai';

async function IARecomendacionEntrevista({ Preguntas, Respuestas, RespuestasCorrectas }) {
    const message = [
        {
            role: "system",
            content: `Eres InterviewSim, un programa que proporciona recomendaciones para mejorar en entrevistas técnicas. Necesito que proporciones recomendaciones basadas en las siguientes preguntas falladas:
                      ${Preguntas.map((pregunta, index) => `
                          Pregunta ${index + 1}: ${pregunta}
                          Respuesta del usuario: ${Respuestas[index]}
                          Respuesta correcta: ${RespuestasCorrectas[index]}
                      `).join('\n')}
                      Devuelve las recomendaciones en formato JSON como el siguiente:
                      {
                          "recommendations": [
                              {
                                  "question": "Pregunta 1",
                                  "recommendation": "Recomendación para mejorar en esta pregunta"
                              },
                              {
                                  "question": "Pregunta 2",
                                  "recommendation": "Recomendación para mejorar en esta pregunta"
                              },
                              ...
                          ]
                      }`
        }
    ];

    const openai = new OpenAI({ apiKey: process.env.TOKEN_OPENAI });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: message,
            max_tokens: 1000,
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error("Error al generar las recomendaciones:", error);
        return { error: "Hubo un error al generar las recomendaciones." };
    }
}

export default IARecomendacionEntrevista;