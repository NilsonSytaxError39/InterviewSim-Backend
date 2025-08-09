import OpenAI from 'openai';

async function IAInfo() {
    const message = [
        {
            role: "system",
            content: `
                Eres InterviewSim, un programa que proporciona información estadística sobre entrevistas técnicas en países de todo el mundo aleatorios con datos reales de internet en el año actual.
                Tu tarea es devolver los datos de las entrevistas técnicas en el siguiente formato JSON:
                {
                    "info": {
                        "data": [
                            {
                                "country": "Nombre del país",
                                "totalInterviews": Número total de entrevistas técnicas en este país (entero positivo)
                            },
                            ...
                        ]
                    }
                }
                Asegúrate de que:
                - Los países sean aleatorios y representen diferentes regiones del mundo.
                - El número total de entrevistas sea un número entero positivo.
                - El formato JSON sea válido y cumpla estrictamente con la estructura proporcionada.
            `
        },
    ];

    const openai = new OpenAI({ apiKey: process.env.TOKEN_OPENAI });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: message,
            max_tokens: 1000,
        });

        // Obtener el contenido de la respuesta
        const responseText = completion.choices[0].message.content;

        // Validar y limpiar la respuesta para garantizar que sea JSON válido
        const cleanResponse = responseText.replace(/'/g, '"').trim();

        // Intentar parsear el JSON
        const parsedResponse = JSON.parse(cleanResponse);

        // Validar que el JSON cumpla con la estructura esperada
        if (
            parsedResponse &&
            parsedResponse.info &&
            Array.isArray(parsedResponse.info.data) &&
            parsedResponse.info.data.every(
                (item) =>
                    typeof item.country === "string" &&
                    typeof item.totalInterviews === "number" &&
                    item.totalInterviews > 0
            )
        ) {
            return parsedResponse;
        } else {
            throw new Error("La respuesta no cumple con el formato esperado.");
        }
    } catch (error) {
        console.error("Error al generar la información:", error);
        return {
            error: "Hubo un error al generar la información. Por favor, inténtalo de nuevo.",
        };
    }
}

export default IAInfo;