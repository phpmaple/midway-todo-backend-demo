import {
  ALL,
  Body,
  Controller,
  Del,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Provide,
  Validate,
} from '@midwayjs/decorator';
import { Context } from 'egg';
import { TaskDTO } from '../dto';
import { Task } from '../entity/task';
import { TaskService } from '../service/task';

@Provide()
@Controller('/api/tasks')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  taskService: TaskService;

  @Get('/')
  async getTasks(): Promise<Task[]> {
    const tasks = await this.taskService.getTasks();
    return tasks;
  }

  @Post('/')
  @Validate()
  @HttpCode(201)
  async addTask(@Body(ALL) taskdto: TaskDTO): Promise<Task> {
    const task = new Task();
    task.content = taskdto.content;
    const taskResult = await this.taskService.addTask(task);
    return taskResult;
  }

  @Del('/:id')
  @HttpCode(204)
  async deleteTask(@Param() id: number): Promise<Task> {
    const taskResult = await this.taskService.deleteTask(id);
    return taskResult;
  }

  @Patch('/:id')
  @Validate()
  async updateTask(
    @Param() id: number,
    @Body(ALL) taskdto: TaskDTO
  ): Promise<Task> {
    const taskResult = await this.taskService.updateTask(id, taskdto.content);
    return taskResult;
  }

  @Post('/:id/close')
  async closeTask(@Param() id: number): Promise<Task> {
    const taskResult = await this.taskService.closeTask(id);
    return taskResult;
  }

  @Post('/:id/reopen')
  async reopenTask(@Param() id: number): Promise<Task> {
    const taskResult = await this.taskService.reopenTask(id);
    return taskResult;
  }

  @Post('/remove-closed-tasks')
  @HttpCode(204)
  async removeClosedTasks() {
    await this.taskService.removeClosedTasks();
  }
}
