import { EPaymentStatusMessage } from './payments.types';
import { Reserve } from '@prisma/client';

export type TWhatsAppTemplate =
  | 'reserve_created'
  | 'reserve_completed'
  | 'cancel_reserve'
  | 'reserve_not_found'
  | 'method_not_allowed';

export type TWhatsAppTemplateMessageAttributes = {
  user_name: Reserve['user_name'];
  date?: string;
  time?: string;
  number?: string;
  payment_status?: EPaymentStatusMessage;
};

export type TWhatsAppTemplateMessage = {
  to: string;
  attributes?: TWhatsAppTemplateMessageAttributes;
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

export type TWhatsAppWebhookEntryValue = {
  messaging_product: 'whatsapp';
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts: {
    profile: { name: 'string' };
    wa_id: string;
  }[];
  messages: {
    from: string;
    id: string;
    timestamp: string;
    text: { body: string };
    type: string;
  }[];
  statuses?: any[];
};

export type TWhatsAppWebhookEntryChanges = {
  value: TWhatsAppWebhookEntryValue;
  field: 'messages';
};

export type TWhatsAppWebhookEntry = {
  id: string;
  changes: TWhatsAppWebhookEntryChanges[];
};

export type TWhatsAppWebhookBody = {
  object: string;
  entry: TWhatsAppWebhookEntry[];
};
