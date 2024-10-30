import { EPaymentStatusMessage } from './payments.types';
import { Reserve } from '@prisma/client';

type TWhatsAppTemplate = 'reserve_created' | 'reserve_completed';

type TWhatsAppTemplateMessageAttributes = {
  user_name: Reserve['user_name'];
  date?: string;
  time?: string;
  number?: string;
  payment_status?: EPaymentStatusMessage;
};

export type TWhatsAppTemplateMessage = {
  to: string;
  attributes: TWhatsAppTemplateMessageAttributes;
  template: TWhatsAppTemplate;
};

type TWhatsAppTemplateComponent = {
  type: 'header' | 'body' | 'footer';
  parameters: { type: string; text: string }[];
};

export type TWhatsAppData = {
  messaging_product: string;
  to: string;
  type: 'text' | 'template';
  template?: {
    name: TWhatsAppTemplate;
    language: {
      code: string;
    };
    components: TWhatsAppTemplateComponent[];
  };
  text?: {
    body: string;
  };
};
