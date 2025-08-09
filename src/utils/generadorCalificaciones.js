export default function generarCalificacionesHTML(calificacion, recomendacion) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h1 style="color: #283e56; text-align: center;">Resultados de tu prueba</h1>
      <p style="font-size: 16px; color: #333;">Hola,</p>
      <p style="font-size: 16px; color: #333;">Aquí tienes los resultados de tu prueba:</p>
      <div style="margin: 20px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff;">
        <h2 style="color: #283e56; text-align: center;">Calificación</h2>
        <p style="font-size: 16px; color: #333;">${calificacion}</p>
      </div>
      <div style="margin: 20px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff;">
        <h2 style="color: #283e56; text-align: center;">Recomendaciones</h2>
        <p style="font-size: 16px; color: #333;">${recomendacion}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">¡Sigue practicando y mejorando tus habilidades!</p>
    </div>
  `;
};