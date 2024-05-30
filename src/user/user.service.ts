import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './Schema/User.entity';
import { Repository } from 'typeorm';
import UpdateUserDTO from './DTO/UpdateUser.dto';
import * as bcrypt from 'bcrypt';
import Ticket from 'src/tickets/Schema/ticket.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();
      if (users.length == 0) {
        throw new NotFoundException('No User found in Databse');
      }
      return users;
    } catch (error) {}
  }

  async getUserById(userId: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} does not exist`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(
        `Error fetching user with id ${userId}: ${error.message}`,
      );
    }
  }

  async updateUserProfile(userId: number, updateUserInfo: UpdateUserDTO) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} does not exist`);
      }

      if (updateUserInfo.fullNames) {
        user.fullNames = updateUserInfo.fullNames;
      }
      if (updateUserInfo.email) {
        user.email = updateUserInfo.email;
      }
      if (updateUserInfo.country) {
        user.country = updateUserInfo.country;
      }
      if (updateUserInfo.phoneNumber) {
        user.phoneNumber = updateUserInfo.phoneNumber;
      }
      if (updateUserInfo.profilePhoto) {
        user.profilePhoto = updateUserInfo.profilePhoto;
      }
      if (updateUserInfo.password) {
        const hashedPassword = await bcrypt.hash(updateUserInfo.password, 10);
        user.password = hashedPassword;
      }

      const updatedUser = await this.userRepository.save(user);

      return {
        message: 'User Updated Successfully',
        updatedUser,
      };
    } catch (error) {
      throw new Error(
        `Error updating user with id ${userId}: ${error.message}`,
      );
    }
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }

    await this.userRepository.delete(user);

    return {
      message: 'User deleted Succesful',
    };
  }

  async userUploadDocumentForVerification(email: string, document: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(`User with email ${email} does not exist`);
      }

      if (user.isDocumentUploaded) {
        throw new Error('User document already uploaded');
      }

      user.document = document;
      user.isDocumentUploaded = true;

      await this.userRepository.save(user);

      return {
        message: 'Document uploaded successfully !!',
      };
    } catch (error) {
      throw new Error(
        `Error uploading document for user with email ${email}: ${error.message}`,
      );
    }
  }

  async approveUserDocument(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(`User with email ${email} does not exist`);
      }

      if (!user.document) {
        throw new Error('User document not uploaded');
      }

      user.isDocumentUploaded = true;
      await this.userRepository.save(user);

      return {
        message: 'Document approved successfully',
      };
    } catch (error) {
      throw new Error(
        `Error approving document for user with email ${email}: ${error.message}`,
      );
    }
  }

  async adminRejectionOfDocument(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(`User with email ${email} does not exist`);
      }

      if (!user.isDocumentUploaded) {
        throw new Error('User document not uploaded');
      }

      if (!user.document) {
        throw new Error('User document not uploaded');
      }

      user.isDocumentUploaded = false;
      await this.userRepository.save(user);

      return {
        message: 'Document rejected successfully',
      };
    } catch (error) {
      throw new Error(
        `Error rejecting document for user with email ${email}: ${error.message}`,
      );
    }
  }
  async updateUserTickets(userEmail: string, tickets: any[]) {
    // Assume you have a User entity with a relation to a Ticket entity
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
      relations: ['tickets'],
    });
    if (user) {
      tickets.forEach((ticket) => {
        const newTicket = this.ticketRepository.create(ticket);
        user.tickets.push(newTicket);
      });
      await this.userRepository.save(user);
    } else {
      throw new Error('User not found');
    }
  }
}
