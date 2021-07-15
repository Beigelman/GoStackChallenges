import { Repository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  private categoriesRepository: Repository<Category>;

  constructor(
    transactionsRepository: TransactionsRepository,
    categoriesRepository: Repository<Category>,
  ) {
    this.transactionsRepository = transactionsRepository;
    this.categoriesRepository = categoriesRepository;
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    let category_id: string;

    const is_category = await this.categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!is_category) {
      const new_category = this.categoriesRepository.create({
        title: category,
      });

      await this.categoriesRepository.save(new_category);

      category_id = new_category.id;
    } else {
      category_id = is_category.id;
    }

    if (type === 'outcome') {
      const { total } = await this.transactionsRepository.getBalance();

      if (value > total) {
        throw new AppError(
          'Outcome can not be bigger then all your money',
          400,
        );
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await this.transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
