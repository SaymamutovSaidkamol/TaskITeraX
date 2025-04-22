import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  isValidUzbekPhoneNumber,
  LoginDto,
  resetPasswordDto,
  Sendotp,
  sendOtpDto,
  VerifyAccount,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user-entities';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { totp } from 'otplib';
import { EskizService } from 'src/eskiz/eskiz.service';
import { Region } from 'src/entities/region-entities';
import { UserStatus } from 'src/Enums/enums';
import { Session } from 'src/entities/session-entities';
import { Request } from 'express';
import * as DeviceDetector from 'device-detector-js';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'generated/prisma';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
    @InjectRepository(Region)
    private region: Repository<Region>,
    @InjectRepository(Session)
    private session: Repository<Session>,
    private mailer: MailService,
    private eskiz: EskizService,
    private jwtService: JwtService,

    private dataSource: DataSource,
  ) {}

  private Error(error: any): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new BadRequestException(error.message);
  }

  async register(data: CreateUserDto) {
    try {
      let checkUser = await this.user.findOne({ where: { phone: data.phone } });

      if (checkUser) {
        throw new BadRequestException('This user  alredy exist!');
      }

      if (data.role == 'ADMIN') {
        throw new BadRequestException(
          "You can't log in unless you are an admin.",
        );
      }

      let checkRegion = await this.region.findOne({
        where: { id: data.region },
      });

      if (!checkRegion) {
        throw new NotFoundException('Region not found');
      }

      if (!isValidUzbekPhoneNumber(data.phone)) {
        throw new BadRequestException(
          'The phone number was entered incorrectly. example(+998941234567)',
        );
      }

      let hashpass = bcrypt.hashSync(data.password, 7);

      let otp = totp.generate('secret' + data.phone);

      // let sendOtp = await this.mailer.sendMail(
      //   data.email,
      //   'New Otp',
      //   `new Otp:  ${otp}`,
      // );

      // await this.eskiz.sendSMS('Send SMS', data.phone);
      data.password = hashpass;

      const newUser = this.user.create({
        ...data,
        password: hashpass,
        region: checkRegion,
      });

      await this.user.save(newUser);
      await this.user.save(newUser);

      return {
        message: 'Registration was successful. Please verify your  account',
        otp,
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async VerifyAccount(data: VerifyAccount) {
    try {
      let checkPhone = await this.user.findOne({
        where: { phone: data.phone },
      });

      if (!checkPhone) {
        throw new NotFoundException('User Not Found');
      }

      let secret = 'secret' + checkPhone.phone;

      console.log(checkPhone, 'phone');
      console.log(secret, 'secret');

      let verifyOtp = totp.verify({ token: data.otp, secret });
      console.log(verifyOtp);

      if (!verifyOtp) {
        throw new BadRequestException('Invalid Otp');
      }

      let update = await this.user.update(
        { phone: data.phone },
        { status: UserStatus.ACTIVE },
      );

      return {
        message: 'Your account has been activated',
      };
    } catch (error) {
      this.Error(error);
    }
  }

  async sendOtp(phone: Sendotp) {
    try {
      if (!isValidUzbekPhoneNumber(phone.phone)) {
        throw new BadRequestException(
          'The phone number was entered incorrectly. exapmle(+998941234567)',
        );
      }

      let checkuser = await this.user.findOne({
        where: { phone: phone.phone },
      });

      console.log(phone.phone);

      if (!checkuser) {
        throw new NotFoundException('User not found');
      }

      let secret = 'secret' + checkuser.phone;

      let otp = totp.generate(secret);

      console.log(typeof otp);

      return { otp };
    } catch (error) {
      this.Error(error);
    }
  }

  async findAll(query: QueryUserDto) {
    const {
      firstName,
      lastName,
      phone,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    const qb = this.user.createQueryBuilder('user');

    if (firstName) {
      qb.andWhere('LOWER(user.firstName) LIKE LOWER(:firstName)', {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      qb.andWhere('LOWER(user.lastName) LIKE LOWER(:lastName)', {
        lastName: `%${lastName}%`,
      });
    }

    if (phone) {
      qb.andWhere('LOWER(user.phone) LIKE LOWER(:phone)', {
        phone: `%${phone}%`,
      });
    }

    if (sortBy === 'fullName') {
      qb.addOrderBy('user.firstName', order.toUpperCase() as 'ASC' | 'DESC');
      qb.addOrderBy('user.lastName', order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy(`user.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC');
    }

    qb.skip((page - 1) * limit); 
    qb.take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async login(data: LoginDto, req: Request) {
    try {
      const checkUser = await this.user.findOne({
        where: { phone: data.phone },
      });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      if (checkUser.status !== UserStatus.ACTIVE) {
        throw new BadRequestException('Please activate your account');
      }

      const checkPassword = bcrypt.compareSync(
        data.password,
        checkUser.password,
      );

      console.log(checkPassword);

      if (!checkPassword) {
        throw new BadRequestException('Wrong password');
      }

      const session = await this.session.findOne({
        where: {
          IpAdress: req.ip,
          user: { id: checkUser.id },
        },
        relations: ['user'],
      });

      if (!session) {
        const userAgent = req.headers['user-agent'] || '';
        const detector = new DeviceDetector();
        const device = detector.parse(userAgent);

        const newSession = this.session.create({
          userId: checkUser.id,
          IpAdress: req.ip,
          info: device,
          date: new Date().toISOString(),
        });
        await this.session.save(newSession);
      }

      let accesToken = this.genAccessToken({
        userId: checkUser.id,
        role: checkUser.role,
      });
      let refreshToken = this.genRefreshToken({
        userId: checkUser.id,
        role: checkUser.role,
      });

      return { access_token: accesToken, refresh_token: refreshToken };
    } catch (error) {
      this.Error(error);
    }
  }

  async sendotpPassword(data: sendOtpDto) {
    try {
      let checkUser = await this.user.findOne({ where: { phone: data.phone } });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      let otp = totp.generate('secret-password' + checkUser.phone);

      // let sendOtp = await this.mailer.sendMail(
      //   checkUser.email,
      //   'New Otp',
      //   `new Otp:  ${otp}`,
      // );

      return { message: 'Confirm password to change password', otp };
    } catch (error) {
      this.Error(error);
    }
  }

  async resetPassword(data: resetPasswordDto) {
    try {
      let checkUser = await this.user.findOne({ where: { phone: data.phone } });

      if (!checkUser) {
        throw new NotFoundException('User Not Found');
      }

      let secret = 'secret-password' + checkUser.phone;
      let verifyOtp = totp.verify({ token: data.otp, secret });

      if (!verifyOtp) {
        throw new BadRequestException('Invalid Otp');
      }

      let newPassHash = bcrypt.hashSync(data.password, 7);

      checkUser.password = newPassHash;

      let user = await this.user.save(checkUser);
      console.log(user);

      return { message: 'Updated successfully' };
    } catch (error) {
      this.Error(error);
    }
  }

  async update(id: number, data: UpdateUserDto, req: Request) {
    try {
      if (req['user'].userId != id) {
        throw new BadRequestException(
          "You cannot change other people's information.",
        );
      }
      let checkUser = await this.user.findOne({ where: { id } });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      if (data.firstName) {
        checkUser.firstName = data.firstName;
      }

      if (data.lastName) {
        checkUser.lastName = data.lastName;
      }

      if (data.email) {
        checkUser.email = data.email;
      }

      let newUser = await this.user.save(checkUser);

      return { data: newUser };
    } catch (error) {}
  }

  async remove(id: number, req: Request) {
    try {
      if (req['user'].userId != id && req['user'].role != Role.ADMIN) {
        throw new BadRequestException(
          "You cannot change other people's information.",
        );
      }
      let checkUser = await this.user.findOne({ where: { id } });

      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      await this.session.delete({ userId: id });
      await this.user.delete(id);
      return { data: checkUser };
    } catch (error) {}
  }

  async MySession(req: Request) {
    try {
      return {
        session: await this.session.findOne({
          where: { userId: req['user'].userId },
        }),
      };
    } catch (error) {
      this.Error(error);
    }
  }

  genRefreshToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: 'refresh_secrest',
      expiresIn: '7d',
    });
  }

  genAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: 'access_secret',
      expiresIn: '12h',
    });
  }
}
