import { Logger, Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

import { MailSendDto } from './dto'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)

  constructor(private readonly mailerService: MailerService) {}

  public sendMail(contact: MailSendDto): void {
    this.mailerService
      .sendMail(contact)
      .then(() => {
        return true
      })
      .catch((error) => {
        console.log('errors', error)
        // this.logger.error(error)
        return false
      })
  }
}
