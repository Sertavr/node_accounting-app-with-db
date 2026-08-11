const expenseService = require('../services/expense.service');
const userService = require('../services/user.service');

const get = async (req, res) => {
  const { userId, categories, from, to } = req.query;

  res.json(
    (
      await expenseService.getAll({
        from,
        to,
        userId,
        category: categories,
      })
    ).map(expenseService.normalize),
  );
};
const getOne = async (req, res) => {
  const { id } = req.params;
  const expense = await expenseService.getById(id);

  if (!expense) {
    res.sendStatus(404);

    return;
  }

  res.json(expenseService.normalize(expense));
};
const create = async (req, res) => {
  const { userId, spentAt, title, amount, category, note } = req.body;

  if (!userId || !spentAt || !title || !amount) {
    res.sendStatus(400);

    return;
  }

  const user = await userService.getById(userId);

  if (!user) {
    res.sendStatus(400);

    return;
  }

  const newExpense = await expenseService.create({
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  });

  res.status(201).json(expenseService.normalize(newExpense));
};
const remove = (req, res) => {
  const { id } = req.params;

  if (!expenseService.getById(id)) {
    res.sendStatus(404);

    return;
  }

  expenseService.remove(id);

  res.sendStatus(204);
};
const update = async (req, res) => {
  const { id } = req.params;

  if (!(await expenseService.getById(id))) {
    res.sendStatus(404);

    return;
  }

  await expenseService.update({ id, ...req.body });

  const updatedExpense = await expenseService.getById(id);

  res.json(expenseService.normalize(updatedExpense));
};

module.exports = {
  get,
  getOne,
  create,
  remove,
  update,
};
