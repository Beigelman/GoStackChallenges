// import AppError from '../errors/AppError';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  transaction_id: string;
}
class DeleteTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public async execute({ transaction_id }: Request): Promise<void> {
    const transaction = await this.transactionsRepository.findOne(
      transaction_id,
    );

    if (!transaction) {
      throw new AppError('Transaction not found');
    }

    await this.transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
