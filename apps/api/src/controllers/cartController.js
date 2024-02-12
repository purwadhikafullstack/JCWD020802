import Cart from '../models/cart';
import Product from '../models/product';

export const getAllCart = async (req, res) => {
  try {
    const data = await Cart.findAndCountAll({
      where: { isActive: true }
    });
    res.status(200).send(data)
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.message });
  }
};

export const getActive = async (req) => {
  const id = req.params.id;
  try {
    const data = await Cart.findAll({
      where: { isActive: true, UserId: id },
      include: [
        {
          model: Product,
          attributes: ['productPrice', 'productName', 'productWeight', 'productMainPicture'],
        },
      ],
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const addToCart = async (req, res) => {
  try {
    const { quantity, UserId, ProductId } = req.body;

    const isExist = await Cart.findOne({
      where: { 
        UserId, 
        ProductId,
        isActive: true 
      },
    });

    if (isExist) {
      const productAdded = 1;
      await Cart.update(
        { quantity: isExist.quantity + productAdded },
        { where: { id: isExist.id } },
      );
    } else {
      await Cart.create({ quantity, UserId, ProductId });
    }
    res.status(201).send({ message: 'Item added to cart', success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

export const remove = async (req, res) => {
  const id = req.params.id;
  try {
    await Cart.destroy({ where: { id: id } });
    res.status(200).send({ message: 'Item removed', success: true });
  } catch (error) {
    return error;
  }
};

export const increment = async (req, res) => {
  const id = req.params.id;
  try {
    const cartItem = await Cart.findOne({ where: { id: id } });
    const product = await Product.findOne({
      where: { id: cartItem.ProductId },
    });

    if (product.totalStock <= cartItem.quantity) {
      res.status(400).send({
        message: 'Exceeded the maximum number of items that can be purchased',
        success: false,
      });
    } else {
      const productAdded = 1;
      await Cart.update(
        { quantity: cartItem.quantity + productAdded },
        { where: { id: id } },
      );
      res.status(200).send({ message: 'Item added', success: true });
    }
  } catch (error) {
    return error;
  }
};

export const decrement = async (req, res) => {
  const id = req.params.id;
  try {
    const cartItem = await Cart.findOne({ where: { id: id } });
    if (cartItem.quantity === 1) {
      await Cart.destroy({ where: { id: id } });
      res
        .status(200)
        .send({ message: 'Item removed from cart', success: true });
    } else {
      const productRemoved = 1;
      await Cart.update(
        { quantity: cartItem.quantity - productRemoved },
        { where: { id: id } },
      );
      res.status(200).send({ message: 'Item quantity renewed', success: true });
    }
  } catch (error) {
    return error;
  }
};
