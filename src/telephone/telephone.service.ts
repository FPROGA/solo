import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TelephoneService {
  async sendPhone(phone: string) {
    try {
      // Путь к файлу логов
      const logFile = path.join(process.cwd(), 'orders.txt');

      // Формируем запись
      const logEntry = `${new Date().toLocaleString('ru-RU')} - ${phone}\n`;

      // Записываем в файл
      fs.appendFileSync(logFile, logEntry);

      console.log(`✅ Номер сохранён: ${phone}`);
      console.log(`📁 Файл: ${logFile}`);

      return { success: true, message: 'Номер сохранён' };
    } catch (error) {
      console.error('Ошибка:', error);
      return { error: 'Ошибка сохранения' };
    }
  }
}
