import { Logger, Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

import { MailSendDto } from 'src/libs/mail/dto'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)

  constructor(private readonly mailerService: MailerService) {}

  /**
    response:
    {
      accepted: [ 'example@mail.com' ],
      rejected: [],
      ehlo: [
        'AUTH PLAIN LOGIN',
        'SIZE 52428800',
        '8BITMIME',
        'SMTPUTF8',
        'PIPELINING',
        'STARTTLS'
      ],
      envelopeTime: 865,
      messageTime: 367,
      messageSize: 7476,
      response: '250 Great success',
      envelope: { from: 'example@mail.com', to: [ 'example@mail.com' ] },
      messageId: '<b09a0b82-4600-0a83-35f3@mail.com>'
    }
  */
  public sendMail(contact: MailSendDto): void {
    this.mailerService
      .sendMail(contact)
      .then(() => {
        return true
      })
      .catch((error) => {
        this.logger.error(error)
        return false
      })
  }
}
