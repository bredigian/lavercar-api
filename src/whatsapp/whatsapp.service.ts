import {
  TWhatsAppData,
  TWhatsAppTemplateMessage,
  TWhatsAppWebhookBody,
  TWhatsAppWebhookEntryValue,
} from 'src/types/whatsapp.types';
import axios, { AxiosRequestConfig } from 'axios';

import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  private readonly ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  private readonly API_URL = process.env.WHATSAPP_API_URL;
  private readonly PHONE_NUMBER = process.env.WHATSAPP_PHONE_NUMBER;

  constructor() {}

  async sendTemplateMessage(payload: TWhatsAppTemplateMessage) {
    const data: TWhatsAppData = {
      messaging_product: 'whatsapp',
      to: payload.to,
      type: 'template',
      template: {
        name: payload.template,
        language: { code: 'es_AR' },
        components: [
          {
            type: 'body',
            parameters:
              payload.template === 'reserve_created'
                ? [
                    { type: 'text', text: payload.attributes.user_name },
                    { type: 'text', text: payload.attributes.date },
                    { type: 'text', text: payload.attributes.time },
                    { type: 'text', text: payload.attributes.number },
                  ]
                : payload.template === 'cancel_reserve'
                  ? [
                      { type: 'text', text: payload.attributes.user_name },
                      { type: 'text', text: payload.attributes.number },
                    ]
                  : payload.template === 'reserve_completed'
                    ? [
                        { type: 'text', text: payload.attributes.user_name },
                        { type: 'text', text: payload.attributes.number },
                        {
                          type: 'text',
                          text: payload.attributes.payment_status,
                        },
                      ]
                    : [],
          },
        ],
      },
    };

    const headers: AxiosRequestConfig['headers'] = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.ACCESS_TOKEN}`,
    };

    const URL = `${this.API_URL}/${this.PHONE_NUMBER}/messages`;

    try {
      return await axios.post(URL, data, { headers });
    } catch (e) {
      console.error('Ocurrió un error al enviar el mensaje por WhatsApp:', e);
    }
  }

  getChange(body: TWhatsAppWebhookBody) {
    return body?.entry[0]?.changes[0]?.value;
  }

  getMessage(change: TWhatsAppWebhookEntryValue) {
    return change.messages?.[0]?.text?.body?.toLowerCase();
  }

  getUserPhone(change: TWhatsAppWebhookEntryValue) {
    return change.contacts?.[0]?.wa_id;
  }
}
