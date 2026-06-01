/*import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRegister } from 'dto/user.register';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import knex from 'knex';
import { UserLogin } from 'dto/user.login';

@Injectable()
export class AuthService {
  private knex: any;

  constructor() {
    this.knex = knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: String(process.env.DB_PASSWORD || 'TemaiSofaBF1!'),
        database: process.env.DB_DATABASE || 'solo',
      },
    });
    console.log('✅ KNEX В SERVISE СОЗДАН!');
  }

  createHashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 10);
    console.log('✅ HASH:', hash.slice(0, 20));
    return hash;
  };
  checkHash = async (inputPassword, storedHash) => {
    try {
      // Сравниваем введенный пароль с хешем из БД
      const isValid = await bcrypt.compare(inputPassword, storedHash);
      return isValid;
    } catch (error) {
      console.error('Ошибка при проверке пароля:', error);
      return false;
    }
  };

  getIDByNumber = async (phoneNumber, password) => {
    const user = await this.knex('users').where({ phoneNumber }).first();
    console.log('user', user);
    console.log('user password', user.password);
    const res = await this.checkHash(password, user.password);
    if (res) {
      console.log('пароли совпадают');
      return user.id;
    } else {
      console.log('неправильный пароль');
    }
  };
  createSessionById = async (user_id) => {
    const session_id = nanoid();
    const insertData = {
      session_id,
      user_id,
    };
    console.log('дата для вставки: ', insertData);
    try {
      await this.knex('sessions').insert(insertData);
      console.log('сессия создана');
    } catch (e) {
      console.error(e);
    }
    return session_id;
  };
  async registerUser(userInfo: UserRegister) {
    try {
      const { username, phoneNumber, password } = userInfo;

      console.log('📥 REGISTER:', { username, phoneNumber, password });

      // ✅ Используем this.knexInstance!
      const exists = await this.knex('users')
        .where('phoneNumber', phoneNumber)
        .orWhere('username', username.trim())
        .first();

      if (exists) {
        throw new BadRequestException('Пользователь уже существует');
      }

      const hashPassword = await this.createHashPassword(password);

      const insertData = {
        username: username.trim(),
        phoneNumber: phoneNumber,
        password: hashPassword,
      };

      console.log('📤 INSERT:', insertData);
      const user = await this.knex('users').where({ phoneNumber: userInfo.phoneNumber }).first();
  
      return {
        message: 'Успешный вход',
        user: {
          id: user.id.toString(),
          username: user.username,
          phoneNumber: user.phoneNumber
      }
  };
    } catch (e: any) {
      console.error('❌ REGISTER ERROR:', e.message);

      if (e.code === '23505' || e.message.includes('duplicate key')) {
        throw new BadRequestException('phoneNumber или username занят');
      }
      throw new InternalServerErrorException(e.message);
    }
  }
  async loginUser(userinfo: UserLogin) {
      const { phoneNumber, password } = userinfo;
      const userId = await this.getIDByNumber(phoneNumber, password);
      if (!userId) {
        throw new BadRequestException('Пользователя не существует');
      }
      const session_id = await this.createSessionById(userId);
      const user =  await this.knex('users')
    .where('phoneNumber', phoneNumber)
    .first();
      return {
      session_id,
      user,
      };
  }
  async logout(session_id) {
  try {
    console.log('🛑 LOGOUT SESSION:', session_id);
    const deleted = await this.knex('sessions')
      .where('session_id', session_id)
      .delete();
    
    console.log('🗑️ Удалено сессий:', deleted);
    
    if (deleted === 0) {
      throw new BadRequestException('Сессия не найдена');
    }
    
    return { message: 'Успешный выход' };
  } catch (error) {
    console.error('❌ LOGOUT ERROR:', error);
    throw new BadRequestException('Ошибка выхода');
  }

}
  async getMe(session_id){
      if (!session_id) {
      throw new UnauthorizedException('Не авторизован');
      }
      console.log(session_id);
    // Проверяем сессию в БД
    const session = await this.knex('sessions')
      .where('session_id', session_id)
      .join('users', 'sessions.user_id', 'users.id')
      .first();

    if (!session) {
      throw new UnauthorizedException('Сессия истекла');
    }

    return {
      id: session.id.toString(),
      username: session.username,
      phoneNumber: session.phoneNumber
    };
    
  }
}
*/
