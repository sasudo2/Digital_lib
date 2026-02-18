export const getInitial = (firstname) => {
  return firstname && firstname.length > 0 ? firstname[0].toUpperCase() : "U";
};
