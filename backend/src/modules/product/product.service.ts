import { prisma } from "../../config/prisma";
import { Product } from "../../types/entities";

const productInclude = {
  category: true,
  supplier: true
};

const serializeProduct = (product: any) => ({
  ...product,
  price: product.price?.toString?.() ?? product.price,
  category: product.category?.name,
  supplier: product.supplier?.name
});

export const getProducts = async () => {
  const products = await prisma.product.findMany({
    include: productInclude,
    orderBy: { id_product: "asc" }
  });
  return products.map(serializeProduct);
};

export const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id_product: id },
    include: productInclude
  });
  return product ? serializeProduct(product) : null;
};

export const createProduct = async (data: Product) => {
  return prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      stock: data.stock,
      id_category: data.id_category,
      id_supplier: data.id_supplier
    }
  });
};

export const updateProduct = async (id: number, data: Product) => {
  return prisma.product.update({
    where: { id_product: id },
    data: {
      name: data.name,
      price: data.price,
      stock: data.stock,
      id_category: data.id_category,
      id_supplier: data.id_supplier
    }
  });
};

export const deleteProduct = async (id: number) => {
  await prisma.product.delete({ where: { id_product: id } });
  return { success: true };
};
