import { z } from "zod";

export const interviewSchema = z.object({
	title: z.string({ required_error: "El título es obligatorio" }),
	empresa: z.string({ required_error: "La empresa es obligatoria" }),
	Dificultad: z.number().min(0).max(5),
	tipoEntrevista: z.enum(["opcionMultiple", "programacion"]),
	// descripción opcional
	description: z.string().optional(),
	detallesTecnicos: z.string().optional(),
	opciones: z.array(z.any()).optional(),
	codigoBase: z.string().optional(),
});
