import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Task } from '../entity/task';

@Provide()
export class TaskService {
  @InjectEntityModel(Task)
  taskModel: Repository<Task>;

  async getActiveTasks() {
    const tasks = await this.taskModel.find();
    return tasks;
  }

  async addTask(task: Task) {
    const taskResult = await this.taskModel.save(task);
    return taskResult;
  }

  async deleteTask(id: number) {
    const taskToRemove = await this.taskModel.findOne(id);
    return await this.taskModel.remove(taskToRemove);
  }

  async updateTask(id: number, content: string) {
    const taskToUpdate = await this.taskModel.findOne(id);
    taskToUpdate.content = content;
    return await this.taskModel.save(taskToUpdate);
  }

  async closeTask(id: number) {
    const taskToClose = await this.taskModel.findOne(id);
    taskToClose.completed = true;
    return await this.taskModel.save(taskToClose);
  }

  async reopenTask(id: number) {
    const taskToOpen = await this.taskModel.findOne(id);
    taskToOpen.completed = false;
    return await this.taskModel.save(taskToOpen);
  }

  async removeClosedTasks() {
    const tasks = await this.taskModel.find({
      where: { completed: true },
      withDeleted: false,
    });

    const allTaskPromise = tasks.map(task => {
      return this.taskModel.softDelete(task.id);
    });

    return await Promise.all(allTaskPromise);
  }
}
