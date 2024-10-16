import { Reserve } from '@prisma/client';

type TWhatsAppTemplateMessageAttributes = {
  user_name: Reserve['user_name'];
  date: string;
  time: string;
  number: string;
};

export type TWhatsAppTemplateMessage = {
  to: string;
  attributes: TWhatsAppTemplateMessageAttributes;
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
    name: string;
    language: {
      code: string;
    };
    components: TWhatsAppTemplateComponent[];
  };
  text?: {
    body: string;
  };
};
