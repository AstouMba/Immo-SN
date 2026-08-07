export const formatFcfa = (value: number) => value.toLocaleString("fr-FR");

export const formatPrice = (price: number, transactionType: "rent" | "sale") =>
  transactionType === "rent" ? `${formatFcfa(price)} FCFA/mois` : `${formatFcfa(price)} FCFA`;
