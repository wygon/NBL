var baseUrl = "http://localhost:2115/api/"


export const getBookingData = async () => {
  const response = await fetch(baseUrl + 'appointments/booking-data');
  if (!response.ok) throw new Error('Błąd pobierania danych');
  return response.json(); // Zwróci kategorie, usługi i dodatki w jednym strzale
};