import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}
  getTasks(userId: number) {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
    });
  }

  async getTaskById({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async createTask({
    userId,
    dto,
  }: {
    userId: number;
    dto: CreateTaskDto;
  }): Promise<Task> {
    return this.prisma.task.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async updateTask({
    id,
    userId,
    dto,
  }: {
    id: number;
    userId: number;
    dto: UpdateTaskDto;
  }): Promise<Task> {
    const task = await this.getTaskById({ id, userId });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteTask({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }): Promise<void> {
    const task = await this.getTaskById({ id, userId });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
