import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TodoService } from './todo.service';
import { Task, User } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task-dto';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTasks(@Req() req: Request): Promise<Task[]> {
    return this.todoService.getTasks((req.user as User).id);
  }

  @Get(':id')
  getTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    return this.todoService.getTaskById({
      id: taskId,
      userId: req.user.id, // npm run start:dev で terminal 上でエラーが出る
    });
  }

  @Post()
  createTask(@Req() req: Request, @Body() dto: CreateTaskDto): Promise<Task> {
    return this.todoService.createTask({
      userId: (req.user as User).id,
      dto,
    });
  }

  @Patch(':id')
  updateTask(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.todoService.updateTask({
      id: taskId,
      userId: (req.user as User).id,
      dto,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTask(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<void> {
    return this.todoService.deleteTask({
      id: taskId,
      userId: (req.user as User).id,
    });
  }
}
