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
  TWhatsAppTemplateMessage,
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
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value
    ) {
      const { statuses } = body.entry[0].changes[0].value;
      if (statuses) return; //Esto significa que si hay una propiedad llamada "statuses" es una actualización del estado del mensaje y no debe seguir ejecutando el endpoint

      if (
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0] &&
        body.entry[0].changes[0].value.contacts &&
        body.entry[0].changes[0].value.contacts[0]
      ) {
        const message =
          body.entry[0].changes[0].value?.messages[0].text?.body?.toLowerCase();
        const user_phone = body?.entry[0]?.changes[0]?.value?.contacts[0].wa_id;

        if (message && user_phone) {
          const [method, reserve_number] = message.split(' ');

          if (method === 'cancelar') {
            console.log('Cancelando turno...');

            const parsed_reserve_number = parseInt(
              reserve_number.replace('#', ''),
            );
            const exists = await this.reservesService.getDetail(
              parsed_reserve_number,
            );
            if (!exists) {
              console.warn('El turno no existe.');

              const message: TWhatsAppTemplateMessage = {
                to: '+542281599471', // Acá iría "user_phone" que es el numero del cliente que envia el mensaje por WhatsApp
                template: 'reserve_not_found',
              };
              await this.service.sendTemplateMessage(message);

              return;
            }

            const canceled = await this.reservesService.cancelByNumber(
              parsed_reserve_number,
              '+542281599471', // Acá iría "user_phone" que es el numero del cliente que envia el mensaje por WhatsApp
            );

            const message: TWhatsAppTemplateMessage = {
              to: '+542281599471', // Acá iría "user_phone" que es el numero del cliente que envia el mensaje por WhatsApp
              template:
                canceled.count === 1 ? 'cancel_reserve' : 'reserve_not_found',
              attributes:
                canceled.count === 1
                  ? {
                      user_name: exists.user_name,
                      number: exists.number.toString().padStart(6, '0'),
                    }
                  : undefined,
            };

            await this.service.sendTemplateMessage(message);
          } else {
            const message: TWhatsAppTemplateMessage = {
              to: '+542281599471', // Acá iría "user_phone" que es el numero del cliente que envia el mensaje por WhatsApp
              template: 'method_not_allowed',
            };
            await this.service.sendTemplateMessage(message);
          }
        }
      }
    }
    return;
  }
}
