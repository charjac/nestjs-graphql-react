import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindManyOptions } from 'typeorm'

import { ListEntity } from './entities/list.entity'
import { TodoEntity } from './entities/todo.entity';
import { CreateListInput, ListQueryInput } from './dto/list.input';
import { CreateTodoInput } from './dto/todo.input';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(ListEntity) private readonly listRepository: Repository<ListEntity>,
    @InjectRepository(TodoEntity) private readonly todoRepository: Repository<TodoEntity>
  ) {}

  async createList(data: CreateListInput) {
    const list = new ListEntity();
    list.label = data.label;
    list.description = data.description;

    return this.listRepository.save(list);
  }

  async createTodo(data: CreateTodoInput) {
    const todo = new TodoEntity();
    todo.label = data.label;
    todo.description = data.description;
    todo.parentId = data.parent;
    
    return this.todoRepository.save(todo);
  }

  async getLists({ sortBy, skip, order, take, ...where }: ListQueryInput = {}) {
    const query: FindManyOptions<ListEntity> = { skip, take, where, relations: ['todos'] };

    if (!!sortBy) query.order = { [sortBy]: order };

    return this.listRepository.find(query);
  }

  async getListById(id: string) {
    return this.listRepository.findOne({ where: { id }, relations: ['todos'] })
  }

  async removeList(id: string) {
    return this.listRepository.remove({ id });
  }

  async getTodosByList(listId: string) {
    return this.todoRepository.find({ where: { parentId: listId } });
  }
}