import OpenAI from 'openai';

async function IA({ title, description, Dificultad, tipoEntrevista }) {
    let message;

    if (tipoEntrevista === 'opcionMultiple') {
        message = [
            {
                role: "system",
                content: `Eres InterviewSim, un programa que genera conjuntos de preguntas para entrevistas técnicas. Necesito que generes 5 preguntas basadas en el tema: ${title} y la siguiente descripción: ${description}.
                          - 5 preguntas deben ser de opción múltiple con 4 opciones cada una y una sola respuesta correcta para cada pregunta.
                          La dificultad debe ser de nivel ${Dificultad} en una escala de 0 a 5.
                          Asegúrate de proporcionar las respuestas correctas para todas las preguntas.
                          Para la pregunta de programación, incluye la pregunta completa que el usuario debe responder y proporciona una solución en código.
                          Devuelve las preguntas y respuestas en formato JSON como el siguiente:
                          {
                              "questions": [
                                  {
                                      "type": "multiple_choice",
                                      "question": "Pregunta 1",
                                      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
                                      "answer": "Opción Correcta"
                                  },
                                  {
                                      "type": "multiple_choice",
                                      "question": "Pregunta 2",
                                      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
                                      "answer": "Opción Correcta"
                                  },
                                  {
                                      "type": "multiple_choice",
                                      "question": "Pregunta 3",
                                      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
                                      "answer": "Opción Correcta"
                                  },
                                  {
                                      "type": "multiple_choice",
                                      "question": "Pregunta 4",
                                      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
                                      "answer": "Opción Correcta"
                                  },
                                  {
                                      "type": "multiple_choice",
                                      "question": "Pregunta 5",
                                      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
                                      "answer": "Opción Correcta"
                                  },
                              ]
                          }`
            }
        ];
    } else if (tipoEntrevista === 'programacion') {
        message = [
            {
                role: "system",
                content: `Eres InterviewSim, un programa que genera preguntas para entrevistas técnicas de programación. Necesito que generes una pregunta de programación basada en el tema: ${title}.
                          La pregunta debe estar basada en la siguiente descripción: ${description}.
                          La dificultad debe ser de nivel ${Dificultad} en una escala de 0 a 5.
                          Asegúrate de proporcionar la respuesta correcta en forma de código.
                          Devuelve la pregunta y la respuesta en formato JSON como el siguiente:
                          {
                              "questions": [
                                  {
                                      "type": "programming",
                                      "question": "Aquí va la pregunta completa que el usuario debe responder",
                                      "description": "${description}",
                                      "answer": "Código de solución"
                                  }
                              ]
                          }`
            }
        ];
    }

    const openai = new OpenAI({ apiKey: process.env.TOKEN_OPENAI });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: message,
            max_tokens: 1000,  
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error("Error al generar las preguntas:", error);
        return { error: "Hubo un error al generar las preguntas." };
    }
}

export default IA;