import csvParse from 'csv-parse';
import fs from 'fs';
import { In, Repository } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  private transactionsRepository: TransactionsRepository;

  private categoriesRepository: Repository<Category>;

  constructor(
    transactionsRepository: TransactionsRepository,
    categoriesRepository: Repository<Category>,
  ) {
    this.transactionsRepository = transactionsRepository;
    this.categoriesRepository = categoriesRepository;
  }

  async execute(filePath: string): Promise<Transaction[]> {
    const contacts_read_stream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parse_CSV = contacts_read_stream.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parse_CSV.on('data', async (line: string[]) => {
      const [title, type, value, category] = line.map((item: string) =>
        item.trim(),
      );

      if (!title || !type || !value || !category) return;

      categories.push(category);

      transactions.push({
        title,
        type: type as 'income' | 'outcome',
        value: Number(value),
        category,
      });
    });

    await new Promise(resolve => parse_CSV.on('end', resolve));

    const existent_categories = await this.categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existent_categories_titles = existent_categories.map(
      (category: Category) => category.title,
    );

    const add_categories = categories
      .filter(category => !existent_categories_titles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const new_categories = this.categoriesRepository.create(
      add_categories.map(title => ({
        title,
      })),
    );

    await this.categoriesRepository.save(new_categories);

    const final_categories = [...new_categories, ...existent_categories];

    const new_transactions = this.transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: final_categories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await this.transactionsRepository.save(new_transactions);

    await fs.promises.unlink(filePath);

    return new_transactions;
  }
}

export default ImportTransactionsService;
