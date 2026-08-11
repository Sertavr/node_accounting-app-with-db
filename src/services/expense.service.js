const { Op } = require('sequelize');
const { Expense } = require('../models/Expense.model');

const normalize = ({ id, userId, spentAt, title, amount, category, note }) => ({
  id,
  userId,
  spentAt,
  title,
  amount,
  category,
  note,
});

const getAll = async ({ userId, from, to, category }) => {
  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (category) {
    where.category = category;
  }

  if (from || to) {
    where.spentAt = {};

    if (from) {
      where.spentAt[Op.gte] = new Date(from);
    }

    if (to) {
      where.spentAt[Op.lte] = new Date(to);
    }
  }

  const expenses = await Expense.findAll({ where });

  return expenses;
};

const getById = (id) => Expense.findByPk(id);

const create = ({
  userId,
  spentAt,
  title,
  amount,
  category = null,
  note = null,
}) => {
  const newExpense = Expense.create({
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  });

  return newExpense;
};
const remove = async (id) => {
  await Expense.destroy({
    where: { id },
  });
};

const update = async ({ id, ...fields }) => {
  await Expense.update(fields, {
    where: { id },
  });
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
  normalize,
};
