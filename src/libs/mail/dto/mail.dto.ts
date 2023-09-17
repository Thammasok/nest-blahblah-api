export class MailSendDto {
  from: string
  to: string
  subject: string
  text?: string
  html?: string
  template?: string
  context?: object
}
