import { Injectable } from '@nestjs/common';
import Flutterwave from 'flutterwave-node-v3';

@Injectable()
export class FlutterwaveService {
  constructor(private flw: Flutterwave) {
    // NestJS will automatically create an instance of Flutterwave and inject it
    // No need to create a new instance manually
  }

  // Your service methods
  async rw_mobile_money() {
    try {
      const payload = {
        tx_ref: 'MC-158523s09v5050e8',
        order_id: 'USS_URG_893982923s2323',
        amount: '1500',
        currency: 'RWF',
        email: 'olufemi@flw.com',
        phone_number: '054709929220',
        fullname: 'John Madakin',
      };

      const response = await this.flw.MobileMoney.rwMobileMoney(payload);
      console.log(response);
    } catch (error) {
      console.error('Error making mobile money payment:', error);
    }
  }
}
