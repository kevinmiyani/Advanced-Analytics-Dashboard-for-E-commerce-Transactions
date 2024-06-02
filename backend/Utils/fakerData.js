const { faker } = require("@faker-js/faker");
const Product = require("../Models/Product");
const Customer = require("../Models/Customer");
const bcrypt = require("bcryptjs");
const Transaction = require("../Models/Transaction");

const generateFakeData = async () => {
  const categories = ["Electronics", "Furniture", "Clothing", "Accessories"];

  for (let i = 0; i < 100; i++) {
    const product = new Product({
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      stock: faker.number.int(100),
      category: categories[Math.floor(Math.random() * categories.length)],
    });

    const savedProduct = await product.save();
    const salt = await bcrypt.genSalt(10);
    const dummypass = faker.string.alpha(10);
    const dummyemail = faker.internet.email();
    const hashedPassword = await bcrypt.hash(dummypass, salt);
    // console.log("=>>", dummyemail, dummypass);
    const customer = new Customer({
      name: faker.person.fullName(),
      email: dummyemail,
      address: faker.location.city(),
      password: hashedPassword,
    });

    const savedCustomer = await customer.save();

    const transaction = new Transaction({
      customerId: savedCustomer._id,
      productId: savedProduct._id,
      quantity: faker.number.int(100),
      totalPrice: savedProduct.price,
      transactiondate: faker.date.past(),
    });

    await transaction.save();
  }
};

module.exports = { generateFakeData };
