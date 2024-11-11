import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Version,
} from '@nestjs/common';

import { WhatsappService } from './whatsapp.service';
import {
  TWhatsAppTemplate,
  TWhatsAppTemplateMessageAttributes,
  TWhatsAppWebhookBody,
} from 'src/types/whatsapp.types';
import { ReservesService } from 'src/reserves/reserves.service';

type TQuery = {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string;
};

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly service: WhatsappService,
    private readonly reservesService: ReservesService,
  ) {}

  @Get()
  @Version('1')
  async verifyWebhook(@Query() query: TQuery) {
    console.log('verificando...');
    const mode = query['hub.mode'];
    const verify_token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    const TOKEN_VERIFICATION = process.env.WHATSAPP_ACCESS_TOKEN;

    if (mode && verify_token === TOKEN_VERIFICATION) return challenge;
    else throw new ForbiddenException();
  }

  @Post()
  @Version('1')
  @HttpCode(HttpStatus.OK)
  async getWebhookNotifications(@Body() body: TWhatsAppWebhookBody) {
    const change = this.service.getChange(body);
    if (!change) return;

    if (change.statuses) return;

    const message = this.service.getMessage(change);
    const user_phone = this.service.getUserPhone(change);

    if (message && user_phone) {
      const [method, value] = message.split(' ');

      if (!value || method !== 'cancelar') {
        await this.service.sendTemplateMessage({
          to: user_phone,
          template: 'method_not_allowed',
        });

        return;
      }

      const parsed_reserve_number = parseInt(value.replace('#', ''));

      const exists = await this.reservesService.getDetail(
        parsed_reserve_number,
      );
      if (!exists) {
        await this.service.sendTemplateMessage({
          to: user_phone,
          template: 'reserve_not_found',
        });

        return;
      }

      const canceled = await this.reservesService.cancelByNumber(
        parsed_reserve_number,
        user_phone,
      );

      const template: TWhatsAppTemplate =
        canceled?.count === 1 ? 'cancel_reserve' : 'reserve_not_found';

      const attributes: TWhatsAppTemplateMessageAttributes | undefined =
        canceled?.count === 1
          ? {
              user_name: exists.user_name,
              number: exists.number.toString().padStart(6, '0'),
            }
          : undefined;

      await this.service.sendTemplateMessage({
        to: user_phone,
        template,
        attributes,
      });
    }
  }
}
