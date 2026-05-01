import * as service from  "./sale.service";

export const createSale = async (body: any) => {
  return await service.createSale(body);
};
export const deleteSale = async (params: any) => {
  return await service.deleteSale(Number(params.id));
};
export const getSales = async () => {
  return await service.getSales();
};
export const getSaleById = async (params: any) => {
  return await service.getSaleById(Number(params.id));
};
export const updateSale = async (params: any, body: any) => {
  return await service.updateSale(Number(params.id), body);
};
export const getSalesByUserId = async (userId: number) => {
  return await service.getSalesByUserId(userId);
};