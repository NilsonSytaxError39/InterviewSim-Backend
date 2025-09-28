import OpenAI from 'openai';

async function IA({ title, description, Dificultad, tipoEntrevista, detallesTecnicos }) {
    let message;

    // Si hay detallesTecnicos, los agregamos a la descripción y lo destacamos para mayor complejidad
    const descripcionFinal = detallesTecnicos && detallesTecnicos.trim() !== ""
        ? `${description ? description + ' ' : ''}ATENCIÓN: Usa los siguientes detalles técnicos para aumentar la complejidad y profundidad de las preguntas: ${detallesTecnicos}`
        : description;

    if (tipoEntrevista === 'opcionMultiple') {
        message = [
            {
                role: "system",
                content: `Eres InterviewSim, un programa que genera conjuntos de preguntas para entrevistas técnicas. Necesito que generes 5 preguntas basadas en el tema: ${title} y la siguiente descripción: ${descripcionFinal}.
                          - 5 preguntas deben ser de opción múltiple con 4 opciones cada una y una sola respuesta correcta para cada pregunta.
                          La dificultad debe ser de nivel ${Dificultad} en una escala de 0 a 5.
                          Asegúrate de proporcionar las respuestas correctas para todas las preguntas.

                          Para la pregunta de programación, incluye la pregunta completa que el usuario debe responder y proporciona una solución en código.
                          Si existen detalles técnicos, DEBES usarlos para aumentar la complejidad y profundidad de la pregunta de programación.
                          ⚠️ Reglas adicionales (válidas para cualquier caso):  
                          - Si el usuario no proporciona una descripción, genera una descripción genérica de programación que tenga sentido en el contexto del título y redacta el enunciado estilo LeetCode en alrededor de 30 palabras.  
                          - Si el título o la descripción son incoherentes, incompletos, ambiguos o inentendibles, **no generes nada**.  
                          - Siempre devuelve el resultado en formato JSON con la estructura indicada.  
                          - Siempre incluye ejemplos de **entrada y salida** claros y coherentes. Si no es posible crear ejemplos, no generes nada.  
                          - Si en la descripción o en los detalles técnicos se mencionan ejemplos de entrada o salida, úsalos como base para los ejemplos generados.
                          - La pregunta debe ser clara, autocontenida y resoluble.  
                          - La respuesta siempre debe estar en **código ejecutable y correcto** en el lenguaje más natural para el tema.
                          
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
                                  }
                              ]
                          }`
            }
        ];
    } else if (tipoEntrevista === 'programacion') {
        message = [
            {
                role: "system",
                content: `Eres InterviewSim, un programa que genera preguntas para entrevistas técnicas de programación.  

Necesito que generes una pregunta de programación basada en el tema: ${title}.  
La pregunta debe estar basada en la siguiente descripción: ${descripcionFinal}.  
La dificultad debe ser de nivel ${Dificultad} en una escala de 0 a 5.  
Si existen detalles técnicos, DEBES usarlos para aumentar la complejidad y profundidad de la pregunta.

⚠️ Reglas adicionales (válidas para cualquier caso):  
- Si el usuario no proporciona una descripción, genera una descripción genérica de programación que tenga sentido en el contexto del título y redacta el enunciado estilo LeetCode en alrededor de 30 palabras.  
- Si el título o la descripción son incoherentes, incompletos, ambiguos o inentendibles, **no generes nada**.  
- Siempre devuelve el resultado en formato JSON con la estructura indicada.  
- Siempre incluye ejemplos de **entrada y salida** claros y coherentes. Si no es posible crear ejemplos, no generes nada.  
- Si en la descripción o en los detalles técnicos se mencionan ejemplos de entrada o salida, úsalos como base para los ejemplos generados.
- La pregunta debe ser clara, autocontenida y resoluble.  
- La respuesta siempre debe estar en **código ejecutable y correcto** en el lenguaje más natural para el tema.  

Devuelve la pregunta y la respuesta en formato JSON como el siguiente:
{
    "questions": [
        {
            "type": "programming",
            "question": "Aquí va la pregunta completa que el usuario debe responder",
            "description": "${descripcionFinal}",
            "difficulty": ${Dificultad},
            "detallesTecnicos": "${detallesTecnicos ? detallesTecnicos : ''}",
            "examples": {
                "input": "Ejemplo de entrada en línea separada",
                "output": "Ejemplo de salida en línea separada"
            },
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

        // Validación para asegurar que los ejemplos existen en preguntas de programación
        const result = JSON.parse(completion.choices[0].message.content);
        if (
            tipoEntrevista === 'programacion' &&
            (
                !result.questions ||
                !result.questions[0].examples ||
                !result.questions[0].examples.input ||
                !result.questions[0].examples.output
            )
        ) {
            throw new Error("La pregunta de programación no contiene ejemplos de entrada y salida.");
        }
        return result;
    } catch (error) {
        console.error("Error al generar las preguntas:", error);
        return { error: "Hubo un error al generar las preguntas." };
    }
}

export default IA;
